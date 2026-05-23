'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import useEvent from '@/src/hooks/useEvent';
import useDebounce from '@/src/hooks/useDebonce';
import { searchAddresses, getAddressDetails, type AddressSuggestion } from '@/src/utils/address';

export interface AddressSearchDetails {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (details: AddressSearchDetails) => void;
  hasError?: boolean;
  placeholder?: string;
  inputClassName?: string;
}

const defaultInputClassName =
  'w-full bg-white border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-(--primary) border-(--primary-light)';

export function AddressSearchInput({
  value,
  onChange,
  onAddressSelect,
  hasError = false,
  placeholder = 'Start typing to search address',
  inputClassName = defaultInputClassName,
}: AddressSearchInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const runAddressSearch = useEvent(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setSearchLoading(true);
    const list = await searchAddresses(query);
    setSuggestions(list);
    setSearchLoading(false);
  });
  const debouncedAddressSearch = useDebounce(runAddressSearch, 300);

  const handleInputChange = useEvent((newValue: string) => {
    onChange(newValue);
    debouncedAddressSearch(newValue);
  });

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddressSelect = useEvent(async (suggestion: AddressSuggestion) => {
    setSelectLoading(true);
    const details = await getAddressDetails(suggestion.placeId);
    setSelectLoading(false);
    setSuggestions([]);
    if (details && onAddressSelect) {
      const country =
        details.country?.toLowerCase() === 'australia' || details.country === 'AU'
          ? 'au'
          : (details.country?.slice(0, 2).toLowerCase() || 'au');
      onAddressSelect({
        street: details.line1 || suggestion.description,
        city: details.city,
        state: details.state,
        zip: details.postcode,
        country,
      });
    } else if (onAddressSelect) {
      onAddressSelect({
        street: suggestion.description,
        city: '',
        state: '',
        zip: '',
        country: 'au',
      });
    }
  });

  const resolvedClassName = hasError ? `${inputClassName} !border-red-500` : inputClassName;

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--primary-dark)">
        <MapPin className="w-4 h-4" />
      </div>
      <input
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (value.trim()) debouncedAddressSearch(value);
        }}
        placeholder={placeholder}
        className={resolvedClassName}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-(--primary-dark)">
        <Search className="w-4 h-4" />
      </div>
      {(searchLoading || selectLoading) && (
        <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
          <Loader2 className="w-4 h-4 animate-spin text-(--primary)" />
        </div>
      )}

      {/* 自渲染建议列表，替代 Antd Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-(--primary-light) rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((v) => (
            <li
              key={v.placeId}
              onClick={() => handleAddressSelect(v)}
              className="px-4 py-3 cursor-pointer text-sm text-(--primary) hover:bg-(--primary-light2) transition-colors border-b border-(--primary-light)/20 last:border-b-0"
            >
              {v.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, Select } from 'antd';
import type { FormErrors } from '@/src/hooks/useCheckout';
import type { Branch } from '@/src/actions/branches';

interface PickupDetailsSectionProps {
  formData: {
    pickupStore: string;
    pickupDate: dayjs.Dayjs | null;
    pickupTime: string;
    note: string;
  };
  fieldErrors: FormErrors;
  inputClass: (field: keyof FormErrors) => string;
  branches: Branch[];
  branchesLoading: boolean;
  availablePickupTimes: string[];
  minPickupDate: dayjs.Dayjs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDateChange: (key: string, date: dayjs.Dayjs | null) => void;
  onNoteChange: (value: string) => void;
}

export function PickupDetailsSection({
  formData, fieldErrors, inputClass,
  branches, branchesLoading, availablePickupTimes, minPickupDate,
  onInputChange, onDateChange, onNoteChange,
}: PickupDetailsSectionProps) {
  return (
    <>
      <h2 className="text-lg uppercase tracking-widest text-(--primary) mt-12 mb-6 border-b pb-2">Pickup Details</h2>
      {!branchesLoading && branches.length > 1 && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Pickup Store</label>
          <Select
            value={formData.pickupStore || undefined}
            onChange={(value) => onInputChange({ target: { name: 'pickupStore', value } } as any)}
            disabled={branchesLoading}
            placeholder={branchesLoading ? 'Loading...' : 'Select store'}
            className={`w-full !h-[48px] [&_.ant-select-selector]:!bg-(--primary-light2) [&_.ant-select-selector]:!border ${fieldErrors.pickupStore ? '[&_.ant-select-selector]:!border-red-500' : '[&_.ant-select-selector]:!border-(--primary-light)'} hover:[&_.ant-select-selector]:!border-(--primary) [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!h-[48px] [&_.ant-select-selection-item]:!leading-[46px] [&_.ant-select-selection-placeholder]:!leading-[46px] [&_.ant-select-selector]:focus-within:!border-(--primary) [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!px-4`}
            options={branches.map((b) => ({ label: b.name, value: String(b.id) }))}
          />
          {fieldErrors.pickupStore && <p className="mt-1 text-xs text-red-500">{fieldErrors.pickupStore}</p>}
        </div>
      )}
      <div>
        <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Pickup Date</label>
        <DatePicker
          value={formData.pickupDate}
          onChange={(date) => onDateChange('pickupDate', date)}
          format="DD MMM YYYY"
          size="large"
          minDate={minPickupDate}
          allowClear={false}
          showToday={false}
          status={fieldErrors.pickupDate ? 'error' : undefined}
          placeholder="DD MMM YYYY"
          className={`!h-[45px] focus-within:!shadow-none focus-within:!border-(--primary) [&_input]:!text-[14px] ${inputClass('pickupDate')}`}
        />
        {fieldErrors.pickupDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.pickupDate}</p>}
        <p className="text-xs text-(--primary-dark)/50 mt-1">Please allow at least 3 business days.</p>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Pickup Time</label>
        <Select
          value={formData.pickupTime}
          onChange={(value) => onInputChange({ target: { name: 'pickupTime', value } } as any)}
          className={`w-full !h-[48px] [&_.ant-select-selector]:!bg-(--primary-light2) [&_.ant-select-selector]:!border ${fieldErrors.pickupTime ? '[&_.ant-select-selector]:!border-red-500' : '[&_.ant-select-selector]:!border-(--primary-light)'} hover:[&_.ant-select-selector]:!border-(--primary) [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!h-[48px] [&_.ant-select-selection-item]:!leading-[46px] [&_.ant-select-selection-placeholder]:!leading-[46px] [&_.ant-select-selector]:focus-within:!border-(--primary) [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!px-4`}
          options={availablePickupTimes.map((t) => ({ label: t, value: t }))}
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Order Notes (Optional)</label>
        <textarea
          value={formData.note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add special requirements or flavors (e.g. for bulk macarons)"
          className="w-full !bg-(--primary-light2) rounded-lg px-4 py-3 focus:!outline-none focus:!border-(--primary) border border-(--primary-light) min-h-[100px]"
        />
      </div>
    </>
  );
}

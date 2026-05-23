'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Edit2, Trash2, X, Loader2, RefreshCw } from 'lucide-react';
import useNotify from '@/src/hooks/useNotifiy';
import useEvent from '@/src/hooks/useEvent';
import {
  listAddressesAction,
  saveAddressAction,
  deleteAddressAction,
  type Address,
  type AddressType,
} from '@/src/actions/address';
import { getErrorMessage } from '@/src/utils/index';
import { AddressSearchInput } from './AddressSearchInput';

const ADDRESS_TYPE_OPTIONS: { value: AddressType; label: string }[] = [
  { value: 5, label: 'Billing' },
  { value: 10, label: 'Shipping' },
];

const emptyForm = {
  type: 5 as AddressType,
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'au',
  isDefault: false,
};

export const AddressList: React.FC = () => {
  const notify = useNotify();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadAddresses = useEvent(async () => {
    setLoading(true);
    try {
      const result = await listAddressesAction();
      if (result.success === false) {
        throw new Error(result.message);
      }
      setAddresses(result.data);
    } catch (e) {
      notify.error({ content: getErrorMessage(e) || 'Failed to load addresses.' });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = useEvent(() => {
    setFormData(emptyForm);
    setFieldErrors({});
    setIsAdding(false);
    setEditingId(null);
  });

  const handleAddressSelectFromSearch = useEvent(
    (details: { street: string; city: string; state: string; zip: string; country: string }) => {
      setFormData((prev) => ({
        ...prev,
        street: details.street,
        city: details.city || prev.city,
        state: details.state || prev.state,
        zip: details.zip || prev.zip,
        country: details.country || prev.country,
      }));
    }
  );

  const handleEdit = useEvent((address: Address) => {
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || 'au',
      isDefault: (
        (address.type === 10 && address.isShippingDefault) ||
        (address.type === 5 && address.isBillingDefault) ||
        false
      ),
    });
    setEditingId(address.id);
    setIsAdding(true);
  });

  const handleDelete = useEvent(async (id: number) => {
    notify.confirm({
      title: 'Delete address',
      content: 'Are you sure you want to delete this address?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeletingId(id);
        try {
          const result = await deleteAddressAction(id);
          if (result.success === false) {
            throw new Error(result.message);
          }
          notify.success({ content: 'Address deleted successfully.' });
          await loadAddresses();
        } catch (e) {
          notify.error({ content: getErrorMessage(e) || 'Failed to delete address.' });
        } finally {
          setDeletingId(null);
        }
      },
    });
  });

  const handleSubmit = useEvent(async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!formData.firstName.trim()) err.firstName = 'First name is required.';
    if (!formData.lastName.trim()) err.lastName = 'Last name is required.';
    if (!formData.street.trim()) err.street = 'Street address is required.';
    if (!formData.city.trim()) err.city = 'City is required.';
    if (!formData.state.trim()) err.state = 'State is required.';
    if (!formData.zip.trim()) err.zip = 'ZIP code is required.';
    setFieldErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitLoading(true);
    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        first_name: formData.firstName.trim() || undefined,
        last_name: formData.lastName.trim() || undefined,
        address: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postcode: formData.zip.trim(),
        country: formData.country,
        type: formData.type,
        is_shipping_default: formData.type === 10 ? formData.isDefault : undefined,
        is_billing_default: formData.type === 5 ? formData.isDefault : undefined,
      };

      const result = await saveAddressAction(payload);
      if (result.success === false) {
        setFieldErrors({ _form: result.message || 'Failed to save address.' });
        return;
      }

      resetForm();
      const method = editingId ? 'updated' : 'added';
      notify.success({ content: `Address ${method} successfully.` });
      await loadAddresses();
    } catch (e) {
      setFieldErrors({ _form: getErrorMessage(e) || 'Failed to save address.' });
    } finally {
      setSubmitLoading(false);
    }
  });

  const handleSetDefault = useEvent(async (address: Address) => {
    setSettingDefaultId(address.id);
    try {
      const result = await saveAddressAction({
        id: address.id,
        first_name: address.firstName,
        last_name: address.lastName,
        address: address.street,
        address_line_2: address.addressLine2,
        city: address.city,
        state: address.state,
        postcode: address.zip,
        country: address.country || 'au',
        type: address.type,
        is_shipping_default: address.type === 10 ? true : false,
        is_billing_default: address.type === 5 ? true : false,
      });
      if (result.success === false) {
        throw new Error(result.message);
      }
      notify.success({ content: 'Set as default address.' });
      await loadAddresses();
    } catch (e) {
      notify.error({ content: getErrorMessage(e) || 'Failed to set default address.' });
    } finally {
      setSettingDefaultId(null);
    }
  });

  const handleFieldChange = useEvent(<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as string] || fieldErrors._form) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        delete next._form;
        return next;
      });
    }
  });

  const typeLabel = (type: AddressType) => ADDRESS_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? 'Address';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-(--primary-light)/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-2xl italic text-(--primary)">My Addresses</h2>
        {!isAdding && (
          <button
            onClick={() => {
              setFormData(emptyForm);
              setEditingId(null);
              setIsAdding(true);
            }}
            className="flex items-center gap-2 text-sm bg-(--primary) text-white px-4 py-2 rounded-full hover:bg-(--primary) transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-(--primary-light2) p-6 rounded-xl border border-(--primary-light)/30 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-(--primary)">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
            <button type="button" onClick={resetForm} className="text-(--primary-dark) hover:!text-(--primary)">
              <X className="w-5 h-5" />
            </button>
          </div>

          {fieldErrors._form && (
            <p className="mb-4 text-xs text-red-500">{fieldErrors._form}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Address Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleFieldChange('type', Number(e.target.value) as AddressType)}
                className="w-full bg-white border border-(--primary-light) rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary)"
              >
                {ADDRESS_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end mb-3">
              <label className="flex items-center gap-2 cursor-pointer text-(--primary) text-sm">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleFieldChange('isDefault', e.target.checked)}
                  className="rounded border-(--primary-light) text-(--primary) focus:ring-(--primary)"
                />
                Set as default address
              </label>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) ${fieldErrors.firstName ? 'border-red-500' : 'border-(--primary-light)'}`}
              />
              {fieldErrors.firstName && <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) ${fieldErrors.lastName ? 'border-red-500' : 'border-(--primary-light)'}`}
              />
              {fieldErrors.lastName && <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Street Address</label>
              <AddressSearchInput
                value={formData.street}
                onChange={(v) => handleFieldChange('street', v)}
                onAddressSelect={handleAddressSelectFromSearch}
                hasError={!!fieldErrors.street}
                placeholder="Start typing to search address"
              />
              {fieldErrors.street && <p className="mt-1 text-xs text-red-500">{fieldErrors.street}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) ${fieldErrors.city ? 'border-red-500' : 'border-(--primary-light)'}`}
              />
              {fieldErrors.city && <p className="mt-1 text-xs text-red-500">{fieldErrors.city}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) ${fieldErrors.state ? 'border-red-500' : 'border-(--primary-light)'}`}
                />
                {fieldErrors.state && <p className="mt-1 text-xs text-red-500">{fieldErrors.state}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => handleFieldChange('zip', e.target.value)}
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) ${fieldErrors.zip ? 'border-red-500' : 'border-(--primary-light)'}`}
                />
                {fieldErrors.zip && <p className="mt-1 text-xs text-red-500">{fieldErrors.zip}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitLoading}
              className="px-6 py-2 text-(--primary-dark) hover:!text-(--primary) disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-(--primary) text-white px-8 py-2 rounded-full uppercase tracking-widest text-sm hover:bg-(--primary) transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitLoading ? (editingId ? 'Updating...' : 'Saving...') : editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-(--primary-dark)">
          <RefreshCw className="mx-auto h-10 w-10 text-(--primary-light) animate-spin" />
          <p className="mt-2 text-sm text-(--primary-dark)">Loading addresses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {addresses.map((address) => {
            const isDefault = address.isShippingDefault || address.isBillingDefault;
            const isBusy = deletingId === address.id || settingDefaultId === address.id;
            return (
              <div
                key={address.id}
                className={`border rounded-xl p-6 transition-all relative ${isDefault ? 'border-(--primary) bg-(--primary-light2)' : 'border-(--primary-light)/30 hover:border-(--primary-light)'
                  } ${isBusy ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {isBusy && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                    <Loader2 className="w-6 h-6 animate-spin text-(--primary)" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-(--primary)" />
                    <span className="font-medium text-(--primary)">{typeLabel(address.type)}</span>
                    {isDefault && (
                      <span className="bg-(--primary) text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isDefault && (
                      <button
                        onClick={() => handleSetDefault(address)}
                        className="text-xs text-(--primary-dark) hover:!text-(--primary) mr-2"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-(--primary-dark) hover:!text-(--primary) hover:bg-white rounded-full transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-(--primary-dark) hover:!text-red-500 hover:bg-white rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-(--primary) text-sm space-y-1">
                  <p className="font-medium">
                    {[address.firstName, address.lastName].filter(Boolean).join(' ') || '—'}
                  </p>
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>
              </div>
            );
          })}
          {!loading && addresses.length === 0 && !isAdding && (
            <p className="text-(--primary-dark) text-sm italic py-8">No addresses saved. Add one above.</p>
          )}
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import useNotify from '@/src/hooks/useNotifiy';
import useEvent from '@/src/hooks/useEvent';
import { updateProfileAction } from '@/src/actions/auth';
import { getErrorMessage } from '@/src/utils/index';

export const UserProfile: React.FC = () => {
  const { user, login } = useAuth();
  const notify = useNotify();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  const handleUpdate = useEvent(async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!formData.firstName) {
      setFieldErrors({ firstName: 'First name is required.' });
      return;
    }
    if (!formData.lastName) {
      setFieldErrors({ lastName: 'Last name is required.' });
      return;
    }
    if (!formData.phone) {
      setFieldErrors({ phone: 'Phone is required.' });
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfileAction({
        first_name: formData.firstName.trim() || undefined,
        last_name: formData.lastName.trim() || undefined,
        phone_number: formData.phone.trim() || undefined,
      });
      if (result.success && result.data) {
        login(result.data);
        setIsEditing(false);
        setFieldErrors({});
        notify.success({ content: 'Profile updated successfully.' });
      } else if ('message' in result) {
        setFieldErrors({ _form: result.message });
      } else {
        setFieldErrors({ _form: 'Update failed. Please try again.' });
      }
    } catch (e) {
      setFieldErrors({ _form: getErrorMessage(e) || 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  });

  const handleCancel = useEvent(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
      });
    }
    setIsEditing(false);
  });

  const handleFieldChange = useEvent((field: 'firstName' | 'lastName' | 'phone', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field] || fieldErrors._form) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        delete next._form;
        return next;
      });
    }
  });

  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-(--primary-light)/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-2xl italic text-(--primary)">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-(--primary-light) hover:!text-(--primary) font-medium"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {fieldErrors._form && (
          <p className="text-xs text-red-500">{fieldErrors._form}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">First Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={`w-full bg-(--primary-light2) border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) disabled:opacity-60 disabled:cursor-not-allowed ${fieldErrors.firstName ? 'border-red-500' : 'border-(--primary-light)'}`}
            />
            {fieldErrors.firstName && <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Last Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={`w-full bg-(--primary-light2) border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) disabled:opacity-60 disabled:cursor-not-allowed ${fieldErrors.lastName ? 'border-red-500' : 'border-(--primary-light)'}`}
            />
            {fieldErrors.lastName && <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Email</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-(--primary-light2) border border-(--primary-light) rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Phone</label>
            <input
              type="tel"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className={`w-full bg-(--primary-light2) border rounded-lg px-4 py-3 focus:outline-none focus:border-(--primary) disabled:opacity-60 disabled:cursor-not-allowed ${fieldErrors.phone ? 'border-red-500' : 'border-(--primary-light)'}`}
            />
            {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2 text-(--primary-dark) hover:!text-(--primary) disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-(--primary) text-white px-8 py-2 rounded-full uppercase tracking-widest text-sm hover:bg-(--primary) transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

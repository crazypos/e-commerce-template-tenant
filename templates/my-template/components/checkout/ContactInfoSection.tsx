'use client';

import React from 'react';
import type { FormErrors } from '@/src/hooks/useCheckout';

interface ContactInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  fieldErrors: FormErrors;
  inputClass: (field: keyof FormErrors) => string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactInfoSection({ formData, fieldErrors, inputClass, onChange }: ContactInfoSectionProps) {
  return (
    <>
      <h2 className="text-lg uppercase tracking-widest text-(--primary) mb-6 border-b pb-2">Contact Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={onChange} className={inputClass('firstName')} />
          {fieldErrors.firstName && <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={onChange} className={inputClass('lastName')} />
          {fieldErrors.lastName && <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Email</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} className={inputClass('email')} />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-(--primary-dark) mb-2">Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={onChange} className={inputClass('phone')} />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
        </div>
      </div>
    </>
  );
}

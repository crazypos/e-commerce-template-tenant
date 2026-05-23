'use client';

import React from 'react';
import { BillingAddressSection } from '@/src/components/BillingAddressSection';
import type { GuestBillingAddress } from '@/src/components/BillingAddressSection';
import type { FormErrors } from '@/src/hooks/useCheckout';
import type { Address } from '@/src/actions/address';

interface BillingSectionProps {
  user: unknown;
  fieldErrors: FormErrors;
  inputClass: (field: keyof FormErrors) => string;
  addresses: Address[];
  addressesLoading: boolean;
  selectedBillingAddressId: number | '';
  guestBillingAddress: GuestBillingAddress;
  onSelectBillingAddress: (id: number | '') => void;
  onAddressesChange: () => void;
  onSelectNewAddress: (id: number | '') => void;
  onGuestAddressChange: (v: Partial<GuestBillingAddress>) => void;
}

export function BillingSection({
  user, fieldErrors, inputClass,
  addresses, addressesLoading, selectedBillingAddressId,
  guestBillingAddress,
  onSelectBillingAddress, onAddressesChange, onSelectNewAddress, onGuestAddressChange,
}: BillingSectionProps) {
  return (
    <>
      <h2 className="text-lg uppercase tracking-widest text-(--primary) mt-12 mb-6 border-b pb-2">Billing Address (Optional)</h2>
      <BillingAddressSection
        isLoggedIn={!!user}
        addresses={addresses}
        selectedBillingAddressId={selectedBillingAddressId}
        onSelectBillingAddress={(id) => {
          onSelectBillingAddress(id);
        }}
        addressesLoading={addressesLoading}
        onAddressesChange={onAddressesChange}
        onSelectNewAddress={onSelectNewAddress}
        guestAddress={guestBillingAddress}
        onGuestAddressChange={(v) => {
          onGuestAddressChange(v);
        }}
        guestAddressErrors={
          !user
            ? {
              address_line_1: fieldErrors.address_line_1,
              city: fieldErrors.city,
              state: fieldErrors.state,
              country: fieldErrors.country,
              postcode: fieldErrors.postcode,
            }
            : undefined
        }
        inputClass={inputClass}
      />
      {user && fieldErrors.billingAddressId && (
        <p className="mt-1 text-xs text-red-500">{fieldErrors.billingAddressId}</p>
      )}
    </>
  );
}

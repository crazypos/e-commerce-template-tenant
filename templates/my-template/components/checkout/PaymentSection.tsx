'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { PaymentMethods } from '@/src/components/PaymentMethods';
import type { PaymentMethodsRef } from '@/src/components/PaymentMethods';
import type { PaymentMethodApi, CheckoutPayload } from '@/src/actions/checkout';

interface PaymentSectionProps {
  paymentMethods: PaymentMethodApi[];
  paymentMethod: CheckoutPayload['payment']['method'];
  paymentLoading: boolean;
  useStoreCredit: boolean;
  paymentMethodsRef: React.RefObject<PaymentMethodsRef | null>;
  onPaymentMethodChange: (method: CheckoutPayload['payment']['method']) => void;
  onUseStoreCreditChange: (v: boolean) => void;
}

export function PaymentSection({
  paymentMethods, paymentMethod, paymentLoading,
  useStoreCredit, paymentMethodsRef,
  onPaymentMethodChange, onUseStoreCreditChange,
}: PaymentSectionProps) {
  return (
    <>
      <h2 className="text-lg uppercase tracking-widest text-(--primary) mt-12 mb-6 border-b pb-2">Payment Details</h2>
      {paymentLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-(--primary)" />
          <div className="text-gray-500 mt-4">Loading payment methods...</div>
        </div>
      ) : !paymentMethods?.length ? (
        <div className="flex flex-col justify-center">
          <div className="text-gray-500">No payment methods available.</div>
        </div>
      ) : (
        <PaymentMethods
          methods={paymentMethods}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          useStoreCredit={useStoreCredit}
          onUseStoreCreditChange={onUseStoreCreditChange}
          ref={paymentMethodsRef}
        />
      )}
    </>
  );
}

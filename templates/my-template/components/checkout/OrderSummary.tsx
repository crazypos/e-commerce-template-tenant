'use client';

import React from 'react';
import Decimal from 'decimal.js';
import { toAmount } from '@/src/utils';
import type { FormErrors, CheckoutCalc } from '@/src/hooks/useCheckout';
import { formatMoney } from '@/src/hooks/useCheckout';
import type { CartItem } from '@/src/context/CartContext';
import Checkbox from '@/src/components/ui/Checkbox';

interface OrderSummaryProps {
  items: CartItem[];
  checkoutCalc: CheckoutCalc | null;
  calcLoading: boolean;
  submitting: boolean;
  inventoryOverstockLoading: boolean;
  subtotal: Decimal;
  taxAmount: Decimal;
  discountAmount: Decimal;
  displayTotal: Decimal;
  creditAmount: Decimal;
  finalTotalDisplay: Decimal;
  useStoreCredit: boolean;
  formData: {
    agreedToTerms: boolean;
    subscribeMarketing: boolean;
  };
  fieldErrors: FormErrors;
  onToggleTerms: (checked: boolean) => void;
  onToggleSubscribe: (checked: boolean) => void;
  onOpenTermsModal: () => void;
  onOpenPrivacyModal: () => void;
}

export function OrderSummary({
  items, checkoutCalc, calcLoading, submitting, inventoryOverstockLoading,
  subtotal, taxAmount, discountAmount, displayTotal, creditAmount, finalTotalDisplay,
  useStoreCredit, formData, fieldErrors,
  onToggleTerms, onToggleSubscribe, onOpenTermsModal, onOpenPrivacyModal,
}: OrderSummaryProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm h-fit">
      <h2 className="text-lg uppercase tracking-widest text-(--primary) mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start">
            <div>
              <p className="font-medium text-(--primary-dark)">{item.name}</p>
              <p className="text-xs text-(--primary)">x {item.quantity}</p>
            </div>
            <p className="font-mono text-(--primary) font-bold">
              ${toAmount(new Decimal(item.price).mul(item.quantity).toFixed(2))}
            </p>
          </div>
        ))}
      </div>

      {checkoutCalc != null && (
        <div className="mt-4 text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-(--primary-dark)">Subtotal</span>
            <span className="font-mono font-semibold text-(--primary)">${formatMoney(subtotal)}</span>
          </div>
          {discountAmount.gt(0) && (
            <div className="flex justify-between items-center">
              <span>Discount</span>
              <span className="font-mono font-semibold">-${formatMoney(discountAmount)}</span>
            </div>
          )}
          {useStoreCredit && (
            <div className="flex justify-between items-center">
              <span>Store Credit</span>
              <span className="font-mono font-semibold">-${formatMoney(creditAmount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-(--primary-dark)">Tax</span>
            <span className="font-mono font-semibold text-(--primary)">${formatMoney(taxAmount)}</span>
          </div>
          <div className="border-t border-(--primary-light)/40 pt-2 flex justify-between items-center">
            <span className="font-medium text-(--primary-dark)">Total</span>
            <span className="font-serif text-xl text-(--primary) font-bold">${formatMoney(finalTotalDisplay)}</span>
          </div>
        </div>
      )}

      {checkoutCalc == null && (
        <div className="mt-4 border border-(--primary-light)/40 rounded-xl px-4 py-3 text-sm flex justify-between items-center">
          <span className="text-(--primary-dark)">Total</span>
          <span className="font-serif text-xl text-(--primary) font-bold">${formatMoney(displayTotal)}</span>
        </div>
      )}

      <button
        type="submit"
        form="checkout-form"
        disabled={submitting || calcLoading || inventoryOverstockLoading}
        className="mt-6 w-full bg-(--primary) text-white py-4 rounded-full uppercase tracking-widest font-medium hover:bg-(--primary) transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Placing Order...' : 'Place Order'}
      </button>

      <div className="space-y-4 mt-8">
        <Checkbox
          id="terms"
          checked={formData.agreedToTerms}
          onChange={onToggleTerms}
          error={fieldErrors.agreedToTerms}
          label={
            <span>
              I have read and agree to the{' '}
              <button type="button" onClick={onOpenTermsModal} className="text-(--primary) font-bold underline underline-offset-2">
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button type="button" onClick={onOpenPrivacyModal} className="text-(--primary) font-bold underline underline-offset-2">
                Privacy Policy
              </button>
            </span>
          }
        />
        <Checkbox
          id="subscribeMarketing"
          checked={formData.subscribeMarketing}
          onChange={onToggleSubscribe}
          label="Subscribe to our marketing updates and special offers"
        />
      </div>
    </div>
  );
}

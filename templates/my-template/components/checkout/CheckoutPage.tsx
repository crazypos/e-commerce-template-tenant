'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Modal, Button, Table } from 'antd';
import Link from '@/src/components/Link';
import useRouter from '@/src/hooks/useRouter';
import clsx from 'clsx';
import { useCheckout } from '@/src/hooks/useCheckout';
import type { GuestBillingAddress } from '@/src/components/BillingAddressSection';
import type { FormErrors } from '@/src/hooks/useCheckout';
import { ContactInfoSection } from './ContactInfoSection';
import { PickupDetailsSection } from './PickupDetailsSection';
import { PaymentSection } from './PaymentSection';
import { BillingSection } from './BillingSection';
import { OrderSummary } from './OrderSummary';

export function CheckoutPage() {
  const {
    items, cartLoading, user, isSubmitted, isGuest, setIsGuest,
    submitting, fieldErrors, setFieldErrors,
    formData, setFormData, paymentMethod, setPaymentMethod,
    paymentMethods, paymentLoading, useStoreCredit, setUseStoreCredit,
    paymentMethodsRef, termsModalVisible, setTermsModalVisible,
    privacyModalVisible, setPrivacyModalVisible, branches, branchesLoading,
    addresses, addressesLoading, selectedBillingAddressId, setSelectedBillingAddressId,
    guestBillingAddress, setGuestBillingAddress, availablePickupTimes, minPickupDate,
    subtotal, taxAmount, discountAmount, displayTotal, creditAmount, finalTotalDisplay,
    inventoryOverstockRows, inventoryOverstockLoading, calcLoading,
    checkoutCalc,
    handleSubmit, handleInputChange, handleDateChange,
    confirmInventoryOverstock, loadAddresses, inputClass,
  } = useCheckout();

  const router = useRouter();

  // ── Loading state ──
  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-(--primary)" />
        <div className="text-gray-500 mt-4">Loading cart...</div>
      </div>
    );
  }

  // ── Submitted state ──
  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-(--primary-light) rounded-full flex items-center justify-center text-(--primary) mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-gray-500 mb-8">Your order has been received. We will contact you shortly.</p>
        {!!user && (
          <Link
            href="/profile/orders"
            className="bg-(--primary) text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-(--primary-dark) transition-colors"
          >
            View Order
          </Link>
        )}
        <Link
          href="/"
          className={clsx(
            'px-8 py-3 rounded-lg font-semibold text-sm transition-colors',
            user ? 'text-gray-600 hover:text-(--primary)' : 'bg-(--primary) text-white hover:bg-(--primary-dark)',
          )}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/" className="text-(--primary) hover:text-(--primary-dark)">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Guest login prompt ──
  if (!user && !isGuest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How would you like to proceed?</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login?redirect=/checkout')}
              className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors"
            >
              Login to Account
            </button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <button
              onClick={() => setIsGuest(true)}
              className="w-full bg-white border border-(--primary) text-(--primary) py-3 rounded-lg font-semibold hover:bg-(--primary-light2) transition-colors"
            >
              Guest Checkout
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            Logging in allows you to save your information for faster checkout next time.
          </p>
        </div>
      </div>
    );
  }

  // ── Main checkout ──
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl italic text-(--primary) mb-12 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: form sections */}
        <div>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <ContactInfoSection
              formData={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
              }}
              fieldErrors={fieldErrors}
              inputClass={inputClass}
              onChange={handleInputChange}
            />

            <PickupDetailsSection
              formData={{
                pickupStore: formData.pickupStore,
                pickupDate: formData.pickupDate,
                pickupTime: formData.pickupTime,
                note: formData.note,
              }}
              fieldErrors={fieldErrors}
              inputClass={inputClass}
              branches={branches}
              branchesLoading={branchesLoading}
              availablePickupTimes={availablePickupTimes}
              minPickupDate={minPickupDate}
              onInputChange={handleInputChange}
              onDateChange={handleDateChange}
              onNoteChange={(value) => setFormData((prev) => ({ ...prev, note: value }))}
            />

            <PaymentSection
              paymentMethods={paymentMethods}
              paymentMethod={paymentMethod}
              paymentLoading={paymentLoading}
              useStoreCredit={useStoreCredit}
              paymentMethodsRef={paymentMethodsRef}
              onPaymentMethodChange={setPaymentMethod}
              onUseStoreCreditChange={setUseStoreCredit}
            />

            <BillingSection
              user={user}
              fieldErrors={fieldErrors}
              inputClass={inputClass}
              addresses={addresses}
              addressesLoading={addressesLoading}
              selectedBillingAddressId={selectedBillingAddressId}
              guestBillingAddress={guestBillingAddress}
              onSelectBillingAddress={(id) => {
                setSelectedBillingAddressId(id);
                if (fieldErrors.billingAddressId) {
                  setFieldErrors((prev) => ({ ...prev, billingAddressId: undefined }));
                }
              }}
              onAddressesChange={loadAddresses}
              onSelectNewAddress={(id) => setSelectedBillingAddressId(id)}
              onGuestAddressChange={(v) => {
                setGuestBillingAddress((prev) => ({ ...prev, ...v }));
                const keys = Object.keys(v) as (keyof GuestBillingAddress)[];
                if (keys.length) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    keys.forEach((k) => delete next[k]);
                    return next;
                  });
                }
              }}
            />
            {user && fieldErrors.billingAddressId && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.billingAddressId}</p>
            )}
          </form>
        </div>

        {/* Right: order summary */}
        <OrderSummary
          items={items}
          checkoutCalc={checkoutCalc}
          calcLoading={calcLoading}
          submitting={submitting}
          inventoryOverstockLoading={inventoryOverstockLoading}
          subtotal={subtotal}
          taxAmount={taxAmount}
          discountAmount={discountAmount}
          displayTotal={displayTotal}
          creditAmount={creditAmount}
          finalTotalDisplay={finalTotalDisplay}
          useStoreCredit={useStoreCredit}
          formData={{ agreedToTerms: formData.agreedToTerms, subscribeMarketing: formData.subscribeMarketing }}
          fieldErrors={fieldErrors}
          onToggleTerms={(checked) => {
            setFormData((prev) => ({ ...prev, agreedToTerms: checked }));
            if (checked && fieldErrors.agreedToTerms) {
              setFieldErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
            }
          }}
          onToggleSubscribe={(checked) => setFormData((prev) => ({ ...prev, subscribeMarketing: checked }))}
          onOpenTermsModal={() => setTermsModalVisible(true)}
          onOpenPrivacyModal={() => setPrivacyModalVisible(true)}
        />
      </div>

      {/* ── Inventory overstock modal ── */}
      <Modal
        closable={false}
        title="Inventory adjustment"
        open={inventoryOverstockRows != null && inventoryOverstockRows.length > 0}
        footer={[
          <Button
            key="back"
            disabled={inventoryOverstockLoading}
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={inventoryOverstockLoading}
            onClick={confirmInventoryOverstock}
          >
            Confirm
          </Button>,
        ]}
      >
        <p className="text-(--primary-dark) mb-3">
          Some items exceed available inventory. Confirm to remove out-of-stock items and cap quantities to stock.
        </p>
        <Table
          dataSource={inventoryOverstockRows ?? []}
          rowKey={(r: { variantId: number }) => `${r.variantId}`}
          pagination={false}
          size="small"
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Inventory', dataIndex: 'inventory', key: 'inventory' },
          ]}
        />
      </Modal>

      {/* ── Terms modal ── */}
      <Modal
        title="Terms and Conditions"
        open={termsModalVisible}
        onOk={() => setTermsModalVisible(false)}
        onCancel={() => setTermsModalVisible(false)}
        footer={[
          <button
            key="close"
            onClick={() => setTermsModalVisible(false)}
            className="px-6 py-2 bg-(--primary) text-white rounded-full hover:bg-(--primary-dark) transition-colors"
          >
            Close
          </button>,
        ]}
        width={700}
      >
        <div className="max-h-[60vh] overflow-y-auto pr-4 text-(--primary-dark) space-y-4">
          <p>
            Welcome to Tico Bakery. By placing an order with us, you agree to our{' '}
            <Link href="/terms-and-conditions" target="_blank" className="text-(--primary) underline">
              full Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" target="_blank" className="text-(--primary) underline">
              Privacy Policy
            </Link>
            :
          </p>
          <h3 className="font-bold text-(--primary)">1. Orders and Pickup</h3>
          <p>Orders must be placed at least 3 days in advance. All orders are for pickup only from our designated locations during specified business hours. Please ensure you select the correct pickup date and time.</p>
          <h3 className="font-bold text-(--primary)">2. Payment</h3>
          <p>Full payment is required at the time of order through our secure payment gateway. We accept major credit cards and other specified payment methods.</p>
          <h3 className="font-bold text-(--primary)">3. Cancellations and Refunds</h3>
          <p>Cancellations made more than 48 hours before the scheduled pickup time will receive a full refund or store credit. Cancellations made within 48 hours are non-refundable as preparation will have already begun.</p>
          <h3 className="font-bold text-(--primary)">4. Product Quality</h3>
          <p>As our products are handcrafted and fresh, please inspect your order at pickup. If there are any issues, notify our staff immediately. Once the order has left our premises, we cannot be held responsible for any damage during transport.</p>
          <h3 className="font-bold text-(--primary)">5. Allergies</h3>
          <p>Please note that our bakery handles nuts, gluten, dairy, and eggs. While we take precautions, we cannot guarantee that any product is completely free of allergens.</p>
          <p className="mt-6 text-xs italic">Last updated: March 2024</p>
        </div>
      </Modal>

      {/* ── Privacy modal ── */}
      <Modal
        title="Privacy Policy"
        open={privacyModalVisible}
        onOk={() => setPrivacyModalVisible(false)}
        onCancel={() => setPrivacyModalVisible(false)}
        footer={[
          <button
            key="close"
            onClick={() => setPrivacyModalVisible(false)}
            className="px-6 py-2 bg-(--primary) text-white rounded-full hover:bg-(--primary-dark) transition-colors"
          >
            Close
          </button>,
        ]}
        width={700}
      >
        <div className="max-h-[60vh] overflow-y-auto pr-4 text-(--primary-dark) space-y-4">
          <p>Your privacy is important to us. Here is how we handle your information during checkout:</p>
          <h3 className="font-bold text-(--primary)">1. Personal Information</h3>
          <p>We collect your name, contact details, and pickup preferences to fulfill your order.</p>
          <h3 className="font-bold text-(--primary)">2. Payment Security</h3>
          <p>Your payment information is processed through secure, third-party payment gateways. We do not store your full card details.</p>
          <h3 className="font-bold text-(--primary)">3. Communications</h3>
          <p>We will contact you via email or phone regarding your order status. Marketing communications are optional.</p>
          <p className="mt-6 text-xs italic text-right">Last updated: March 2024</p>
        </div>
      </Modal>
    </div>
  );
}

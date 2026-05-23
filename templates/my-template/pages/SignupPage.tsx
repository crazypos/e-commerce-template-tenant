'use client';

import { useState } from 'react';
import { Link, AgreementCheckbox } from '../components';
import { useSignup } from '@/src/hooks/useSignup';
import { useBusinessSignup } from '@/src/hooks/useBusinessSignup';

type AccountType = 'individual' | 'business';

export function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>('individual');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-(--primary-light2)">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Create Account</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Choose your account type to get started</p>

        {/* Account Type Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setAccountType('individual')}
            className={`p-5 rounded-xl border-2 text-center transition-all ${
              accountType === 'individual'
                ? 'border-(--primary) bg-(--primary-light)'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-16 h-16 rounded-full border-4 border-(--primary) flex items-center justify-center mx-auto mb-3 bg-(--primary-light)">
              <svg className="w-8 h-8 text-(--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className={`font-semibold ${accountType === 'individual' ? 'text-(--primary)' : 'text-gray-700'}`}>
              Individual
            </h3>
            <p className="text-xs text-gray-400 mt-1">Retail pricing for personal use</p>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('business')}
            className={`p-5 rounded-xl border-2 text-center transition-all ${
              accountType === 'business'
                ? 'border-(--primary) bg-(--primary-light)'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-16 h-16 rounded-full border-4 border-(--primary) flex items-center justify-center mx-auto mb-3 bg-(--primary-light)">
              <svg className="w-8 h-8 text-(--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className={`font-semibold ${accountType === 'business' ? 'text-(--primary)' : 'text-gray-700'}`}>
              Business Account
            </h3>
            <p className="text-xs text-gray-400 mt-1">Wholesale pricing &amp; bulk discounts</p>
          </button>
        </div>

        {accountType === 'individual' ? <IndividualSignupForm /> : <BusinessSignupForm />}

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-(--primary) font-medium hover:text-(--primary-dark)">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Individual registration — reuses the standard useSignup hook. */
function IndividualSignupForm() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    telephone,
    setTelephone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,
    sendCodeLoading,
    isLoading,
    fieldErrors,
    agreedToTerms,
    setAgreedToTerms,
    handleSendCode,
    validateAndSubmit,
  } = useSignup();

  return (
    <form onSubmit={validateAndSubmit} className="space-y-5">
      {fieldErrors._form && <p className="text-xs text-red-500">{fieldErrors._form}</p>}
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" value={firstName} onChange={setFirstName} error={fieldErrors.firstName} />
        <Field label="Last Name" value={lastName} onChange={setLastName} error={fieldErrors.lastName} />
      </div>
      <Field label="Email" type="email" value={email} onChange={setEmail} error={fieldErrors.email} />
      <Field label="Telephone" type="tel" value={telephone} onChange={setTelephone} error={fieldErrors.telephone} />
      <Field label="Password" type="password" value={password} onChange={setPassword} error={fieldErrors.password} />
      <Field
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={fieldErrors.confirmPassword}
      />
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.code ? 'border-red-500' : 'border-gray-300'}`}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendCodeLoading}
            className="shrink-0 px-4 py-2.5 border border-(--primary) text-(--primary) rounded-lg text-xs font-semibold hover:bg-(--primary) hover:text-white transition-colors disabled:opacity-50"
          >
            {sendCodeLoading ? 'Sending...' : 'Send Code'}
          </button>
        </div>
        {fieldErrors.code && <p className="mt-1 text-xs text-red-500">{fieldErrors.code}</p>}
      </div>
      <AgreementCheckbox
        applicationPath="terms"
        agreementType="terms_conditions"
        checked={agreedToTerms}
        onChange={setAgreedToTerms}
      />
      {fieldErrors.agreedToTerms && <p className="text-xs text-red-500">{fieldErrors.agreedToTerms}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}

/** Business registration — demonstrates ABN lookup + registerBusinessAction. */
function BusinessSignupForm() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    telephone,
    setTelephone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,
    businessName,
    setBusinessName,
    abn,
    setAbn,
    abnVerified,
    setAbnVerified,
    address,
    setAddress,
    addressLine2,
    setAddressLine2,
    city,
    setCity,
    stateVal,
    setStateVal,
    zipcode,
    setZipcode,
    agreedToTerms,
    setAgreedToTerms,
    isLoading,
    fieldErrors,
    sendCodeLoading,
    abnSearching,
    handleAbnSearch,
    handleSendCode,
    validateAndSubmit,
  } = useBusinessSignup();

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
        We will review your application and approve your business account ASAP. Our account manager will contact you via
        email or phone call.
      </div>

      <form onSubmit={validateAndSubmit} className="space-y-5">
        {fieldErrors._form && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{fieldErrors._form}</p>}

        {/* ABN Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">ABN</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="e.g. 11 222 333 444"
                value={abn}
                onChange={(e) => {
                  setAbn(e.target.value);
                  setAbnVerified(false);
                }}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.abn ? 'border-red-500' : abnVerified ? 'border-green-500' : 'border-gray-300'}`}
              />
              {abnVerified && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded">
                  Verified
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAbnSearch}
              disabled={abnSearching || !abn.trim()}
              className="shrink-0 px-4 py-2.5 border border-(--primary) text-(--primary) rounded-lg text-xs font-semibold hover:bg-(--primary) hover:text-white transition-colors disabled:opacity-50"
            >
              {abnSearching ? 'Verifying...' : 'Verify ABN'}
            </button>
          </div>
          {fieldErrors.abn && <p className="mt-1 text-xs text-red-500">{fieldErrors.abn}</p>}
        </div>

        <Field label="Business Name" value={businessName} onChange={setBusinessName} error={fieldErrors.businessName} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" value={firstName} onChange={setFirstName} error={fieldErrors.firstName} />
          <Field label="Last Name" value={lastName} onChange={setLastName} error={fieldErrors.lastName} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} error={fieldErrors.email} />
          <Field label="Telephone" type="tel" value={telephone} onChange={setTelephone} error={fieldErrors.telephone} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
          />
          <Field
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={fieldErrors.confirmPassword}
          />
        </div>

        <div>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.code ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={sendCodeLoading}
              className="shrink-0 px-4 py-2.5 border border-(--primary) text-(--primary) rounded-lg text-xs font-semibold hover:bg-(--primary) hover:text-white transition-colors disabled:opacity-50"
            >
              {sendCodeLoading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
          {fieldErrors.code && <p className="mt-1 text-xs text-red-500">{fieldErrors.code}</p>}
        </div>

        {/* Address Fields */}
        <p className="text-sm font-medium text-gray-700 pt-2">Business Address</p>
        <Field label="Street Address" value={address} onChange={setAddress} error={fieldErrors.address} />
        <Field label="Street Address 2" value={addressLine2} onChange={setAddressLine2} />
        <div className="grid grid-cols-3 gap-4">
          <Field label="City" value={city} onChange={setCity} error={fieldErrors.city} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <select
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.state ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select state</option>
              {STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {fieldErrors.state && <p className="mt-1 text-xs text-red-500">{fieldErrors.state}</p>}
          </div>
          <Field label="Postcode" value={zipcode} onChange={setZipcode} error={fieldErrors.zipcode} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
          <input
            type="text"
            value="Australia"
            disabled
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500"
          />
        </div>

        <AgreementCheckbox
          applicationPath="terms"
          agreementType="terms_conditions"
          checked={agreedToTerms}
          onChange={setAgreedToTerms}
        />
        {fieldErrors.agreedToTerms && <p className="text-xs text-red-500">{fieldErrors.agreedToTerms}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Business Account...' : 'Register Business Account'}
        </button>
      </form>
    </>
  );
}

// ── Shared ──

function Field({
  label,
  type = 'text',
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const STATES = [
  { value: 'Australia Capital Territory', label: 'ACT' },
  { value: 'New South Wales', label: 'NSW' },
  { value: 'Northern Territory', label: 'NT' },
  { value: 'Queensland', label: 'QLD' },
  { value: 'South Australia', label: 'SA' },
  { value: 'Tasmania', label: 'TAS' },
  { value: 'Victoria', label: 'VIC' },
  { value: 'Western Australia', label: 'WA' },
];

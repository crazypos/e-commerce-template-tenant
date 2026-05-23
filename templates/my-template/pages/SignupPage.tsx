'use client';

import React from 'react';
import { Link, Checkbox, AgreementCheckbox } from '../components';
import { useSignup } from '@/src/hooks/useSignup';
import { validateEmail, validatePassword } from '@/src/utils/validation';

export function SignupPage() {
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
    setFieldErrors,
    agreedToTerms,
    setAgreedToTerms,
    subscribeMarketing,
    setSubscribeMarketing,
    handleSendCode,
    submitRegistration,
  } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!firstName.trim()) err.firstName = 'First name is required.';
    if (!lastName.trim()) err.lastName = 'Last name is required.';
    const emailErr = validateEmail(email);
    if (emailErr) err.email = emailErr;
    if (!telephone.trim()) err.telephone = 'Telephone is required.';
    const pwdErr = validatePassword(password);
    if (pwdErr) err.password = pwdErr;
    if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match.';
    if (!code.trim()) err.code = 'Verification code is required.';
    if (!agreedToTerms) err.agreedToTerms = 'You must agree to the terms and conditions.';
    setFieldErrors(err);
    if (Object.keys(err).length > 0) return;
    submitRegistration({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      password,
      confirm_password: confirmPassword,
      code: code.trim(),
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-(--primary-light2)">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Create Account</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Join us for exclusive treats and faster checkout</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fieldErrors._form && <p className="text-xs text-red-500">{fieldErrors._form}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.firstName && <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.lastName && <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telephone</label>
            <input
              type="tel"
              required
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.telephone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.telephone && <p className="mt-1 text-xs text-red-500">{fieldErrors.telephone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
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

          <div className="space-y-4">
            <AgreementCheckbox
              applicationPath="terms"
              agreementType="terms_conditions"
              checked={agreedToTerms}
              onChange={setAgreedToTerms}
            />

            {fieldErrors.agreedToTerms && <p className="text-xs text-red-500">{fieldErrors.agreedToTerms}</p>}

            <Checkbox
              id="subscribeMarketing"
              checked={subscribeMarketing}
              onChange={setSubscribeMarketing}
              label="Subscribe to our newsletter for exclusive treats and updates"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

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

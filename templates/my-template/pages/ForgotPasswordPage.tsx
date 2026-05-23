'use client';

import React from 'react';
import { Link } from '../components';
import { useForgotPassword } from '@/src/hooks/useForgotPassword';

export function ForgotPasswordPage() {
  const {
    step,
    email,
    code,
    password,
    confirmPassword,
    fieldErrors,
    sendCodeLoading,
    resetLoading,
    updateField,
    handleSendCode,
    handleResetPassword,
    handleBackToEmail,
  } = useForgotPassword();

  if (step === 'done') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-(--primary-light2)">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm text-center">
          <div className="w-16 h-16 bg-(--primary-light) rounded-full flex items-center justify-center mx-auto mb-6 text-(--primary)">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors text-sm text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-(--primary-light2)">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Reset Password</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Enter your email to receive a verification code</p>

          <form onSubmit={handleSendCode} className="space-y-6">
            {fieldErrors._form && (
              <p className="text-xs text-red-500">{fieldErrors._form}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={sendCodeLoading}
              className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendCodeLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link href="/login" className="text-(--primary) font-medium hover:text-(--primary-dark)">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // step === 'reset'
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-(--primary-light2)">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Set New Password</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Enter the code sent to your email and choose a new password
        </p>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {fieldErrors._form && (
            <p className="text-xs text-red-500">{fieldErrors._form}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
              value={email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter code from email"
              value={code}
              onChange={(e) => updateField('code', e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.code ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.code && <p className="mt-1 text-xs text-red-500">{fieldErrors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => updateField('password', e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm space-y-2">
          <button
            type="button"
            onClick={handleBackToEmail}
            className="block w-full text-gray-500 hover:text-(--primary)"
          >
            Use a different email
          </button>
          <Link href="/login" className="block text-(--primary) font-medium hover:text-(--primary-dark)">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

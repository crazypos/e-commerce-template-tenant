'use client';

import React, { Suspense, useState } from 'react';
import { Link, AgreementCheckbox } from '../components';
import { useLogin } from '@/src/hooks/useLogin';

function LoginForm() {
  const { email, setEmail, password, setPassword, fieldErrors, isLoading, handleSubmit, clearFieldError } = useLogin();

  const [agreed, setAgreed] = useState(true);

  return (
    <>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-(--primary-light2)">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Sign in to manage your orders and profile</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-(--primary) hover:text-(--primary-dark)">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
            </div>

            <AgreementCheckbox
              applicationPath="terms"
              agreementType="terms_conditions"
              checked={agreed}
              onChange={setAgreed}
            />

            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="w-full bg-(--primary) text-white py-3 rounded-lg font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-(--primary) font-medium hover:text-(--primary-dark)">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

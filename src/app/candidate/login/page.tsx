'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../utils/api';
import Logo from '../../../components/Logo';

export default function CandidateLoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setTimeout(() => setEmail(emailParam), 0);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toastError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<{ accessToken: string }>('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res && res.accessToken) {
        await authLogin(res.accessToken);
        toastSuccess('Access granted. Welcome to your examination dashboard.');
        router.push('/candidate');
      } else {
        toastError('Authentication failed.');
      }
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Invalid credentials or access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-50/50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <Logo size={42} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 font-display">
          Candidate Access Portal
        </h2>
        <p className="text-sm text-neutral-500 font-medium">
          Enter your registered email and the portal password sent by your recruiter.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-xs border border-neutral-100 sm:rounded-2xl sm:px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700">
                Registered Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="candidate@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700">
                Portal Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your invitation password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 pr-10 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-neutral-400 hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-neutral-400 hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors disabled:opacity-75"
            >
              {loading ? 'Authenticating...' : 'Enter Secure Workspace'}
            </button>
          </form>

          <div className="mt-6 border-t border-neutral-100 pt-4 text-center">
            <span className="text-3xs font-semibold text-neutral-400 uppercase tracking-wider block">
              ProctorAI Security Verification Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

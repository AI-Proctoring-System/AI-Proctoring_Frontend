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
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your invitation password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none transition-colors"
              />
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

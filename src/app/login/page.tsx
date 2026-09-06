'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiRequest } from '../../utils/api';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toastError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      toastError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest<{ accessToken: string }>('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response && response.accessToken) {
        toastSuccess('Successfully logged in!');
        login(response.accessToken);
        router.push('/dashboard');
      } else {
        throw new Error('Authentication token not received.');
      }
    } catch (err) {
      const errorVal = err as Error;
      const msg = errorVal.message || 'Login failed. Please check your credentials.';
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex w-full min-h-screen antialiased bg-[#f8f9fa] text-neutral-900">
      {/* Left Panel: Brand Presence & AI Proctoring Showcase (Visible on md and larger) */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 relative overflow-hidden p-10 lg:p-14 text-white"
        style={{
          background:
            'linear-gradient(145deg, rgb(22, 36, 30) 0%, rgb(31, 51, 43) 40%, rgb(45, 74, 62) 85%, rgb(56, 91, 77) 100%)',
        }}
      >
        {/* Subtle geometric cybersecurity grid & ambient glow overlays */}
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#adcebe 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: '#3d6354' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: '#adcebe' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#16241e]/70 via-transparent to-[#1f332b]/85 pointer-events-none" />

        {/* Content Top: Brand Identity */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[#adcebe] shadow-sm">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#adcebe]"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path
                d="M8 12c1.5-2 2.5-3 4-3s2.5 1 4 3-2.5 3-4 3-2.5-1-4-3z"
                fill="none"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="1.5" className="fill-current text-[#adcebe]" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-sans">
            Proctor<span className="text-[#adcebe]">AI</span>
          </span>
        </div>

        {/* Content Bottom: Secure AI Proctoring Value Proposition */}
        <div className="relative z-10 max-w-lg pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ccdcd5]/30 bg-[#2d4a3e]/60 backdrop-blur-md text-[#adcebe] text-xs font-medium mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#62df7d] animate-pulse shadow-[0_0_8px_#62df7d]" />
            Automated Integrity System
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Secure AI Proctoring
          </h1>
          <p className="text-sm lg:text-base text-[#adcebe] opacity-95 leading-relaxed font-normal">
            Empowering educational institutions and certification bodies with unwavering integrity,
            technological sophistication, and professional oversight.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col gap-6 bg-white p-8 sm:p-10 rounded-2xl border border-[#ccdcd5]/60 shadow-[0px_8px_30px_rgba(22,51,40,0.06)]">
          {/* Form Header */}
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#ccdcd5] bg-[#e9f0ec] text-[#2d4a3e] text-[11px] font-semibold tracking-wide uppercase w-fit">
              Sign In Portal
            </span>
            <h2 className="text-2xl sm:text-[28px] font-bold text-[#163328] tracking-tight leading-tight">
              Welcome back
            </h2>
            <p className="text-sm text-[#59605d]">
              Please enter your institutional credentials.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2d4a3e]" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727974] pointer-events-none flex items-center">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-[#ccdcd5] rounded-lg text-sm text-[#163328] placeholder:text-[#727974]/70 transition-all focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2d4a3e]" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#2d4a3e] hover:text-[#1f332b] hover:underline transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727974] pointer-events-none flex items-center">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-white border border-[#ccdcd5] rounded-lg text-sm text-[#163328] placeholder:text-[#727974]/70 transition-all focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#727974] hover:text-[#163328] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center bg-[#2d4a3e] hover:bg-[#1f332b] text-white text-sm font-semibold rounded-lg shadow-[0px_4px_12px_rgba(45,74,62,0.25)] hover:shadow-[0px_6px_16px_rgba(31,51,43,0.35)] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-4 border-t border-[#ccdcd5]/40">
            <p className="text-sm text-[#59605d]">
              Need an account?{' '}
              <Link href="/signup" className="font-semibold text-brand-green hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


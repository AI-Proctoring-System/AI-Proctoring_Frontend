'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiRequest } from '../../utils/api';

export default function SignupPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Interface states
  const [isLoading, setIsLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Debounced email availability check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!email) {
        setEmailExists(null);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailExists(null);
        return;
      }

      setEmailChecking(true);
      try {
        const response = await apiRequest<{ exists: boolean }>(
          `auth/check-email?email=${encodeURIComponent(email)}`
        );
        setEmailExists(response.exists);
        if (response.exists) {
          toastWarning('This email is already registered to a company.');
        }
      } catch (err: unknown) {
        console.error('Error checking email availability:', err);
      } finally {
        setEmailChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email, toastWarning]);

  // Convert uploaded file to base64 Data URL
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please upload a valid image file for the company logo.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toastError('Image file must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoDataUrl(reader.result);
      }
    };
    reader.onerror = () => {
      toastError('Error reading the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoDataUrl(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email || !password || !firstName || !lastName || !companyName) {
      toastError('Please fill in all required fields.');
      return;
    }

    if (!termsAccepted) {
      toastError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (password.length < 8) {
      toastError('Password must be at least 8 characters long.');
      return;
    }

    if (emailExists) {
      toastError('Cannot register: This email is already in use.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest<{ accessToken: string }>('auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          companyName,
          logoDataUrl,
        }),
      });

      if (response && response.accessToken) {
        toastSuccess('Registration successful! Welcome to ProctorAI.');
        login(response.accessToken);
        router.push('/');
      } else {
        throw new Error('Registration succeeded but token was not returned.');
      }
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden bg-[#f1f6f3]">
      {/* Background Ambient Glow & Motifs */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[700px] h-[700px] rounded-full bg-[#e9f0ec] blur-3xl -top-40 -right-20 absolute" />
        <div className="w-[600px] h-[600px] rounded-full bg-[#dbe8e1] blur-3xl -bottom-20 -left-20 absolute" />
      </div>

      {/* Central Registration Card Container */}
      <div className="w-full max-w-[620px] relative z-10 my-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#ccdcd5]/80 p-7 sm:p-10 shadow-[0_20px_45px_-15px_rgba(31,51,43,0.12),0_0_1px_1px_rgba(45,74,62,0.08)] transition-all">
          {/* Card Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#e9f0ec] border border-[#ccdcd5] text-xs font-semibold text-[#2d4a3e] tracking-wide">
                <svg
                  className="w-4 h-4 text-[#2d4a3e]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
                <span>INSTITUTIONAL PORTAL</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Create your company account
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Start protecting the integrity of your examinations with automated AI proctoring.
            </p>
          </div>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Inputs (2-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                  htmlFor="first-name"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                  htmlFor="last-name"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
                />
              </div>
            </div>

            {/* Company / University Name */}
            <div>
              <label
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                htmlFor="company-name"
              >
                Company / Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company-name"
                name="company-name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corporation or Cambridge Academy"
                className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
              />
            </div>

            {/* Company Logo Upload Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Logo <span className="text-slate-400 lowercase font-normal">(optional)</span>
              </label>
              <div className="relative flex items-center gap-4 rounded-xl border border-dashed border-[#ccdcd5] bg-[#e9f0ec]/40 p-3.5 hover:bg-[#e9f0ec]/60 transition">
                {/* Upload Thumbnail Preview */}
                {logoDataUrl ? (
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-[#ccdcd5] flex items-center justify-center p-1 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoDataUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full rounded object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-xs"
                      title="Remove Logo"
                    >
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-[#ccdcd5]/80 flex items-center justify-center text-slate-400 shadow-sm">
                    <svg className="w-6 h-6 text-[#2d4a3e]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </div>
                )}

                {/* Upload CTA & Instructions */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-white text-[#2d4a3e] border border-[#ccdcd5] hover:bg-slate-50 transition shadow-xs"
                    >
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                      Select Logo
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleLogoChange}
                      className="sr-only"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, SVG up to 2MB. Automatically resized.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Address Input */}
            <div>
              <label
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                htmlFor="email"
              >
                Work Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-slate-300 bg-white/90 pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Email Availability Indicators */}
              {emailChecking && (
                <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-[#2d4a3e]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Checking email availability...
                </p>
              )}
              {!emailChecking && emailExists === true && (
                <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                  <span>❌ This email is already registered to a company.</span>
                </p>
              )}
              {!emailChecking && emailExists === false && (
                <p className="mt-1 text-xs text-[#2d4a3e] font-semibold flex items-center gap-1">
                  <span>✓ Email is available.</span>
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  htmlFor="password"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Minimum 8 characters</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white/90 pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:border-[#2d4a3e] focus:ring-2 focus:ring-[#2d4a3e]/20"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#2d4a3e] focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox Notice */}
            <div className="flex items-start pt-1">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="h-4 w-4 rounded border-slate-300 text-[#2d4a3e] focus:ring-[#2d4a3e]"
                />
              </div>
              <div className="ml-2.5 text-xs text-slate-600">
                <label htmlFor="terms">
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-[#2d4a3e] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-[#2d4a3e] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || emailChecking || emailExists === true}
                className="w-full py-3 px-4 rounded-lg bg-[#2d4a3e] hover:bg-[#1f332b] text-white font-semibold text-sm sm:text-base tracking-wide shadow-md shadow-[#2d4a3e]/25 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registering Company...
                  </span>
                ) : (
                  'Register Company'
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-[#ccdcd5]/60 text-center">
            <div className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#2d4a3e] hover:text-[#1f332b] hover:underline ml-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Micro Copyright / Footer Note */}
        <p className="text-center text-xs text-slate-500/80 mt-6 font-medium">
          © {new Date().getFullYear()} ProctorAI Technologies Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}


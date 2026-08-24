'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiRequest } from '../../utils/api';
import Logo from '../../components/Logo';

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
        const response = await apiRequest<{ exists: boolean }>(`auth/check-email?email=${encodeURIComponent(email)}`);
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
    <div className="flex flex-1 items-center justify-center bg-neutral-50/50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <Logo size={40} className="mb-4" />
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Create your company account
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Start protecting the integrity of your examinations with AI.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Grid for Name fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-neutral-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-neutral-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Company details */}
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-neutral-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company-name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                placeholder="Acme Corporation"
              />
            </div>

            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Company Logo <span className="text-xs text-neutral-400">(Optional)</span>
              </label>
              <div className="mt-1 flex items-center gap-4 rounded-lg border border-dashed border-neutral-200 p-4">
                {logoDataUrl ? (
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoDataUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Remove Logo"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 text-sm">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
                  >
                    Select Logo
                  </label>
                  <p className="mt-1 text-xs text-neutral-400">PNG, JPG, SVG up to 2MB. Automatically resized.</p>
                </div>
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                placeholder="name@company.com"
              />
              {/* Real-time Email check UI indicators */}
              {emailChecking && (
                <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-brand-green" fill="none" viewBox="0 0 24 24">
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
                <p className="mt-1 text-xs text-brand-green font-semibold flex items-center gap-1">
                  <span>✓ Email is available.</span>
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                placeholder="•••••••• (Min 8 characters)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || emailChecking || emailExists === true}
              className="group relative flex w-full justify-center rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-green-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register Company'
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center text-sm text-neutral-500 mt-6">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-brand-green hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

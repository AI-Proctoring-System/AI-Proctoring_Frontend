'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { apiRequest } from '../../../utils/api';

interface CompanyData {
  name: string;
  email?: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: CompanyData | null;
}

export default function SettingsPage() {
  const { success: toastSuccess, error: toastError } = useToast();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);

  // Status states
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest<ProfileResponse>('auth/profile');
        if (data) {
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          if (data.company) {
            setCompanyName(data.company.name || '');
            setCompanyEmail(data.company.email || '');
            setWebsiteUrl(data.company.websiteUrl || '');
            setDescription(data.company.description || '');
            setLogoDataUrl(data.company.logoUrl || undefined);
          }
        }
      } catch (err) {
        toastError('Failed to load profile details.');
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    loadProfile();
  }, [toastError]);

  // Handle Logo Upload conversion to base64
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toastError('Image file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoDataUrl(undefined);
  };

  // Submit Profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await apiRequest('auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName,
          lastName,
          companyName,
          companyEmail: companyEmail || undefined,
          websiteUrl: websiteUrl || undefined,
          description: description || undefined,
          logoDataUrl: logoDataUrl || null,
        }),
      });

      if (response) {
        toastSuccess('Profile updated successfully!');
      }
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Company Profile</h1>
        <p className="mt-1 text-sm text-neutral-500">Update company identity, logo, website, and recruiter details.</p>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            {/* First Name */}
            <div>
              <label htmlFor="first-name" className="block text-sm font-semibold text-neutral-700">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last-name" className="block text-sm font-semibold text-neutral-700">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
              />
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company-name" className="block text-sm font-semibold text-neutral-700">
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
              />
            </div>

            {/* Company Email */}
            <div>
              <label htmlFor="company-email" className="block text-sm font-semibold text-neutral-700">
                Company Contact Email
              </label>
              <input
                id="company-email"
                type="email"
                placeholder="info@company.com"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
              />
            </div>

            {/* Website URL */}
            <div className="sm:col-span-2">
              <label htmlFor="website-url" className="block text-sm font-semibold text-neutral-700">
                Website URL
              </label>
              <input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-neutral-700">
                Company Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Provide a brief summary of your company's core operations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
              />
            </div>

            {/* Logo Upload Section */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-neutral-700">Company Logo</label>
              <div className="mt-2 flex items-center gap-6 rounded-xl border border-dashed border-neutral-200 p-6 bg-neutral-50/50">
                {logoDataUrl ? (
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-100 bg-white p-1.5 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoDataUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-sm"
                      title="Remove Logo"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-sm">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
                  >
                    Select Logo File
                  </label>
                  <p className="mt-2 text-xs text-neutral-400">PNG, JPG, or SVG up to 2MB. Logo is stored securely in base64.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-neutral-50">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-green py-2 px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

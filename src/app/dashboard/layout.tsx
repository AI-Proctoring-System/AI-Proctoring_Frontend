'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'CANDIDATE') {
        router.push('/candidate');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-neutral-500">Loading your secure workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role === 'CANDIDATE') {
    return null; // Prevents flashing while redirecting
  }

  return (
    <div className="flex h-screen w-full bg-neutral-50/50 overflow-hidden">
      {/* Recruiter Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-brand-green/10 px-2.5 py-1 text-xs font-bold text-brand-green tracking-wide uppercase">
              Company Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-semibold">
              Logged in as <strong className="text-neutral-700">{user?.email}</strong>
            </span>
          </div>
        </header>

        <main className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

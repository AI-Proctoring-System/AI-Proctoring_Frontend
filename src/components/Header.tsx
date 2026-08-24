'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Logo size={28} />
        </Link>

        {/* Center Nav Links (Optional helper links) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/#features" 
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-brand-green"
          >
            Features
          </Link>
          <Link 
            href="/#about" 
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-brand-green"
          >
            How it Works
          </Link>
          <Link 
            href="/#pricing" 
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-brand-green"
          >
            Pricing
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Initials circle */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green font-semibold text-xs border border-brand-green-border">
                  {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-neutral-700 max-w-[150px] truncate">
                  {user?.email}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-green-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

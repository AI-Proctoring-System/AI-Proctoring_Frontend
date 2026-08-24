import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/privacy" className="text-sm text-neutral-500 hover:text-brand-green">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-neutral-500 hover:text-brand-green">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm text-neutral-500 hover:text-brand-green">
            Support
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-neutral-500 md:text-left">
            &copy; {new Date().getFullYear()} ProctorAI. All rights reserved. Secure and AI-driven proctoring solutions.
          </p>
        </div>
      </div>
    </footer>
  );
}

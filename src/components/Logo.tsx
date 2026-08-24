import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-green animate-pulse"
      >
        {/* Shield outline */}
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        
        {/* Eye outer boundary */}
        <path d="M8 12c1.5-2 2.5-3 4-3s2.5 1 4 3-2.5 3-4 3-2.5-1-4-3z" fill="none" strokeWidth="1.5" />
        
        {/* Pupil/Iris */}
        <circle cx="12" cy="12" r="1.5" className="fill-brand-green" />
      </svg>
      <span className="font-sans font-bold tracking-tight text-xl text-neutral-900">
        Proctor<span className="text-brand-green font-semibold">AI</span>
      </span>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const sections = [
  { id: 'assessment-security', title: 'Assessment Security' },
  { id: 'candidate-verification', title: 'Candidate Verification' },
  { id: 'ai-proctoring', title: 'AI-Powered Proctoring' },
  { id: 'risk-detection', title: 'Risk & Incident Detection' },
  { id: 'data-protection', title: 'Data Protection' },
  { id: 'audit-reports', title: 'Audit & Reports' },
];

export default function SecurityOverviewPage() {
  const [activeSection, setActiveSection] = useState('assessment-security');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#16231c] font-sans antialiased selection:bg-[#2d4a3e] selection:text-white">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#12231c] via-[#1a3429] to-[#254637] py-12 md:py-16 border-b border-white/10 text-white shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(#4bc96b_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#4bc96b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-72 h-72 bg-[#62df7d]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-start gap-4 md:gap-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#163328]/80 backdrop-blur-md border border-[#62df7d]/30 shadow-sm rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#62df7d] animate-pulse shadow-[0_0_8px_#62df7d]" />
            <span className="text-xs text-[#c9ead9] font-semibold uppercase tracking-wider">
              Security &amp; Architecture
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white tracking-tight font-bold">
              Security Overview
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#d2e7dc] leading-relaxed">
              Protecting your assessments, candidate data, and hiring process.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm rounded-lg text-[#c9ead9] text-xs font-mono">
              <svg className="w-4 h-4 text-[#62df7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>SOC 2 Type II Certified • FERPA &amp; GDPR Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Horizontal Jump Navigation (Visible on < lg screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#d2dbd5]/60 shadow-xs px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => scrollToSection(e, sec.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeSection === sec.id
                  ? 'bg-[#2d4a3e] text-white shadow-xs'
                  : 'bg-[#f0f7f3] text-[#1a3028] border border-[#d2dbd5]/40 hover:bg-[#e2ece6]'
              }`}
            >
              {sec.title}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content Structure (Two Column) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 sticky top-6 space-y-5 hidden lg:block">
            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#d2dbd5]/50">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d2dbd5]/40">
                <span className="text-[11px] font-mono text-[#1a3028] uppercase tracking-wider font-semibold">
                  On this page
                </span>
                <span className="text-[11px] font-mono text-[#708077] font-medium">6 Sections</span>
              </div>

              <nav className="flex flex-col gap-1">
                {sections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? 'bg-[#eaf1ec] text-[#1a3028] font-bold shadow-xs'
                          : 'text-[#3d4d44] hover:bg-[#f0f7f3] hover:text-[#1a3028]'
                      }`}
                    >
                      <span className="leading-snug">{sec.title}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'text-[#1a3028] opacity-100 translate-x-0.5'
                            : 'opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Security Guarantee Card */}
            <div className="bg-[#f0f7f3] border border-[#d2dbd5]/60 rounded-xl p-5 shadow-xs flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#1a3028]">
                <svg className="w-5 h-5 text-[#2d4a3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" />
                </svg>
                <span className="text-sm font-bold text-[#1a3028]">Defense In Depth</span>
              </div>
              <p className="text-xs text-[#3d4d44] leading-relaxed">
                Multiple layers of authentication, access control, data encryption, and real-time behavioral telemetry protect every stage of your examination lifecycle.
              </p>
            </div>
          </aside>

          {/* Document Content Column */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. Assessment Security */}
            <section
              id="assessment-security"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  01
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Assessment Security</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                Keep your assessments protected from unauthorized access at all times:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Secure Company Authentication</strong>
                    <span className="text-xs text-[#3d4d44]">Encrypted credentials and session verification for company administrators.</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Role-Based Access Control</strong>
                    <span className="text-xs text-[#3d4d44]">Granular permissions to ensure users only access relevant testing data.</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Protected Assessment Management</strong>
                    <span className="text-xs text-[#3d4d44]">Secure creation, configuration, and maintenance of test materials.</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Restricted Candidate Access</strong>
                    <span className="text-xs text-[#3d4d44]">Candidate access is restricted solely to authorized, scheduled assessments.</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-3">
                <svg className="w-4 h-4 text-[#2d4a3e] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-[#1a3028]">Secure, encrypted assessment session containers.</span>
              </div>
            </section>

            {/* 2. Candidate Verification */}
            <section
              id="candidate-verification"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  02
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Candidate Verification</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                Ensure the person taking the assessment is genuinely the registered candidate:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Identity Verification</strong>
                    <span className="text-xs sm:text-sm text-[#3d4d44]">Multi-point credential matching against government IDs and institutional records.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Face Verification &amp; Biometric Liveness</strong>
                    <span className="text-xs sm:text-sm text-[#3d4d44]">Continuous 3D face mesh validation to prevent photo injection or screen replays.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Candidate Session Validation</strong>
                    <span className="text-xs sm:text-sm text-[#3d4d44]">Ongoing verification ensuring the authenticated person remains the active tester throughout.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm text-[#1a3028] block">Detection of Additional People</strong>
                    <span className="text-xs sm:text-sm text-[#3d4d44]">Automatic notification if secondary individuals enter the testing frame or background.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. AI-Powered Proctoring */}
            <section
              id="ai-proctoring"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  03
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">AI-Powered Proctoring</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                Monitor assessment sessions for potentially suspicious behavior in real time. Our system can detect:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#3d4d44]">
                <div className="p-3 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#2d4a3e] shrink-0" />
                  <span className="font-semibold text-[#1a3028]">Multiple people in camera frame</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#2d4a3e] shrink-0" />
                  <span className="font-semibold text-[#1a3028]">Mobile phones &amp; unauthorized objects</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#2d4a3e] shrink-0" />
                  <span className="font-semibold text-[#1a3028]">Head pose &amp; persistent gaze drift</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#2d4a3e] shrink-0" />
                  <span className="font-semibold text-[#1a3028]">Suspicious browser tab / window activity</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#2d4a3e] shrink-0" />
                  <span className="font-semibold text-[#1a3028]">Audio anomalies &amp; whispered speech</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#2d4a3e] shrink-0" />
                  <span className="font-semibold text-[#1a3028]">Configured proctoring rule violations</span>
                </div>
              </div>
            </section>

            {/* 4. Risk & Incident Detection */}
            <section
              id="risk-detection"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  04
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Risk &amp; Incident Detection</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-4 leading-relaxed">
                Identify suspicious sessions with high accuracy without having to manually monitor every single candidate in real time.
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-[#f0f7f3] border border-[#d2dbd5]/40 space-y-3">
                <div className="flex items-center gap-2.5 text-[#1a3028] font-bold text-sm">
                  <svg className="w-5 h-5 text-[#2d4a3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" />
                  </svg>
                  <span>Normalized Event Scoring</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                  AI-detected events are collected and analyzed to help generate an objective risk score for each assessment session. Companies can review flagged events with synchronized timestamps and make their own final decisions.
                </p>
              </div>
            </section>

            {/* 5. Data Protection */}
            <section
              id="data-protection"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  05
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Data Protection</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                Your company&apos;s assessment data stays protected across all infrastructure layers:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a3028]">Secure TLS 1.3 / DTLS API communication</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a3028]">Protected AES-256 database storage and isolated tenant access</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a3028]">Authenticated access with JWT session tokens to company records</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a3028]">Controlled access to candidate biometric and telemetry records</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a3028]">Proctoring reports available strictly to authorized company users</span>
                </div>
              </div>
            </section>

            {/* 6. Audit & Reports */}
            <section
              id="audit-reports"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  06
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Audit &amp; Reports</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                Stay continuously informed about assessment activity with granular logs:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <strong className="text-xs sm:text-sm text-[#1a3028] block mb-1">Candidate Assessment Status</strong>
                  <span className="text-xs text-[#3d4d44]">Real-time completion, connectivity, and progress status.</span>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <strong className="text-xs sm:text-sm text-[#1a3028] block mb-1">Detected Violations</strong>
                  <span className="text-xs text-[#3d4d44]">Chronological incident timestamps with video-synchronized evidence.</span>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <strong className="text-xs sm:text-sm text-[#1a3028] block mb-1">Proctoring Events</strong>
                  <span className="text-xs text-[#3d4d44]">Complete lifecycle telemetry from check-in to final submission.</span>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <strong className="text-xs sm:text-sm text-[#1a3028] block mb-1">Risk Scores &amp; Dossiers</strong>
                  <span className="text-xs text-[#3d4d44]">Exportable PDF dossiers and LMS-synced grade reports.</span>
                </div>
              </div>
            </section>

            {/* Bottom Callout: Your security is our priority */}
            <section className="bg-[#2d4a3e] text-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-2.5 mb-2">
                <svg className="w-5 h-5 text-[#c9ead9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" />
                </svg>
                <h3 className="text-lg sm:text-xl font-bold text-white">Your security is our priority</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#e9f0ec] leading-relaxed">
                We use multiple layers of authentication, access control, data protection, and AI-powered monitoring to help companies conduct trustworthy, secure assessments.
              </p>
            </section>

            {/* Bottom Navigation */}
            <div className="pt-4 flex items-center justify-between border-t border-[#d2dbd5]/40 text-xs font-medium text-[#708077]">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[#3d4d44] hover:text-[#1a3028] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to ProctorAi
              </Link>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-[#3d4d44] hover:text-[#1a3028] transition-colors cursor-pointer"
              >
                Back to top
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

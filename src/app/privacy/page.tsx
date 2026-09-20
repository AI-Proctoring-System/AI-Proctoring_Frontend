'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'what-we-collect', title: 'What We Collect' },
  { id: 'why-we-collect', title: 'Why We Collect It' },
  { id: 'what-we-dont-do', title: "What We Don't Do" },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'security', title: 'Security' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact Information' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');

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
              Your Privacy Matters
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white tracking-tight font-bold">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#d2e7dc] leading-relaxed">
              How ProctorAi collects, processes, protects, and retains information during online assessments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm rounded-lg text-[#c9ead9] text-xs font-mono">
              <svg className="w-4 h-4 text-[#62df7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
              </svg>
              <span>Last updated: August 25, 2026</span>
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
                <span className="text-[11px] font-mono text-[#708077] font-medium">9 Sections</span>
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

            {/* Privacy First Callout Card */}
            <div className="bg-[#f0f7f3] border border-[#d2dbd5]/60 rounded-xl p-5 shadow-xs flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#1a3028]">
                <svg className="w-5 h-5 text-[#2d4a3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
                </svg>
                <span className="text-sm font-bold text-[#1a3028]">Privacy First Guarantee</span>
              </div>
              <p className="text-xs text-[#3d4d44] leading-relaxed">
                Your assessment data is handled strictly for exam integrity. We never monetize candidate identities, audio recordings, or behavioral telemetry.
              </p>
            </div>
          </aside>

          {/* Document Content Column */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. Overview */}
            <section
              id="overview"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  01
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Overview</h2>
              </div>
              <div className="space-y-4 text-[#3d4d44] text-sm sm:text-[15px] leading-relaxed">
                <p>
                  ProctorAi is an AI-assisted proctoring system designed to ensure academic integrity during online examinations. We take candidate privacy seriously and are committed to transparent, minimal, and secure data handling practices.
                </p>
                <p>
                  This document outlines how telemetry streams, verification photographs, and continuous identity checkpoints are handled when you authenticate into an assessment session orchestrated by ProctorAi on behalf of your testing institution.
                </p>
              </div>
            </section>

            {/* 2. What We Collect */}
            <section
              id="what-we-collect"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  02
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">What We Collect</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                During an active assessment session, ProctorAi captures specific operational datasets required solely for validation and event auditing:
              </p>

              <div className="space-y-3.5">
                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">Video feed</span>
                    <span className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Real-time webcam video analyzed locally and in-session to monitor gaze direction, presence, and verify that only the authorized candidate remains in frame.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">Room-scan images</span>
                    <span className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      A 360° environment capture submitted during pre-exam workspace calibration to confirm testing conditions meet standardized institutional standards.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">Derived biometric signals</span>
                    <span className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Calculated metrics including gaze vector angles, head pose estimations, and landmark coordinates. Raw geometric points are transiently processed to assess attention stability.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">Face verification embedding</span>
                    <span className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      A mathematical vector generated from your credential photograph and webcam check-in. Embeddings are one-way cryptographic tokens and cannot recreate your face likeness.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">Audio feed</span>
                    <span className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Microphone ambient feed processed for acoustic anomaly identification, speech detection, and room noise frequency spikes.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">Device and session metadata</span>
                    <span className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Operating system identifiers, browser configuration, display resolutions, window focus/blur logs, latency figures, and connection IP addresses.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Why We Collect It */}
            <section
              id="why-we-collect"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  03
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Why We Collect It</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                Every telemetry point serves an explicit purpose directly bound to testing integrity:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f0f7f3] border border-[#d2dbd5]/40 p-4 rounded-lg flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1a3028] font-bold">Candidate verification</span>
                  <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                    Validating identity continuously ensures that the authenticated candidate is the one seated and completing the examination.
                  </p>
                </div>

                <div className="bg-[#f0f7f3] border border-[#d2dbd5]/40 p-4 rounded-lg flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1a3028] font-bold">Environment integrity</span>
                  <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                    Verifying that no unauthorized secondary devices, study aides, or secondary persons are present in the workstation.
                  </p>
                </div>

                <div className="bg-[#f0f7f3] border border-[#d2dbd5]/40 p-4 rounded-lg flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1a3028] font-bold">Risk score generation</span>
                  <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                    Synthesizing telemetry vectors into a fair, normalized event timeline so human proctors can quickly review contextual anomalies.
                  </p>
                </div>

                <div className="bg-[#f0f7f3] border border-[#d2dbd5]/40 p-4 rounded-lg flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1a3028] font-bold">Exam recording &amp; reports</span>
                  <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                    Preserving an indisputable audit ledger in the event of institutional grade appeals, contested flags, or accreditation inquiries.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. What We Don't Do */}
            <section
              id="what-we-dont-do"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  04
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">What We Don&apos;t Do</h2>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <div className="w-9 h-9 rounded-full bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e] shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M4.93 4.93l14.14 14.14" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">No third-party AI services</span>
                    <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Your webcam feeds, biometric embeddings, and workspace recordings are never transferred to external machine learning vendors, public LLMs, or generalized model training sets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <div className="w-9 h-9 rounded-full bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e] shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">No advertising or profiling</span>
                    <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      We never build demographic trackers, sell user information to data brokers, or use test telemetry to create commercial behavioral profiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40">
                  <div className="w-9 h-9 rounded-full bg-[#eaf1ec] flex items-center justify-center text-[#2d4a3e] shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#1a3028] font-bold block mb-0.5">No unreviewed automated disqualifications</span>
                    <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Algorithms generate event flags, never decisions. ProctorAi explicitly prohibits automated exam termination without mandatory review and human confirmation by your institution&apos;s designated proctors.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Data Retention */}
            <section
              id="data-retention"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  05
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Data Retention</h2>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  We enforce strict data lifecycle limits governed by institutional agreement and regulatory requirements:
                </p>

                <div className="p-5 rounded-xl bg-[#f0f7f3] border border-[#d2dbd5]/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d2dbd5]/40 pb-3 gap-2">
                    <span className="text-sm text-[#1a3028] font-bold">Session Recordings &amp; Telemetry</span>
                    <span className="text-xs font-mono text-[#1a3028] px-2.5 py-1 bg-[#eaf1ec] rounded border border-[#d2dbd5]/40 font-semibold self-start sm:self-auto">
                      Appeal Window + 90 Days
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                    Retained only for the active duration of the institution&apos;s formal grade-appeal window plus 90 calendar days to accommodate administrative adjudication, after which records are automatically scheduled for cryptographic shredding.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d2dbd5]/40 pb-3 pt-2 gap-2">
                    <span className="text-sm text-[#1a3028] font-bold">Room Scan Panoramic Stills</span>
                    <span className="text-xs font-mono text-[#1a3028] px-2.5 py-1 bg-[#eaf1ec] rounded border border-[#d2dbd5]/40 font-semibold self-start sm:self-auto">
                      Purged in 30 Days
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                    Workspace baseline environmental scans and 360-degree calibration panos are permanently expunged 30 days after test submission unless explicitly flagged in an ongoing academic review.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Your Rights */}
            <section
              id="your-rights"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  06
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Your Rights</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-4 leading-relaxed">
                As a student or testing candidate, you maintain comprehensive agency over your personal telemetry record:
              </p>

              <ul className="space-y-3 text-sm text-[#3d4d44]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">
                    <strong className="text-[#1a3028]">Access to risk report:</strong> You are entitled to view any AI confidence metric, anomaly flag, or supervisory incident report created during your testing period.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">
                    <strong className="text-[#1a3028]">Correction:</strong> If institutional identity metadata contains errors, requests for rectification will be prioritized immediately.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">
                    <strong className="text-[#1a3028]">Early deletion:</strong> Upon closure of grade accreditation, you may petition for early expungement of biometric vectors by submitting a verified inquiry to our data compliance team at{' '}
                    <a className="text-[#2d4a3e] font-semibold underline hover:text-[#1f332b]" href="mailto:privacy@proctorai.com">
                      privacy@proctorai.com
                    </a>.
                  </span>
                </li>
              </ul>
            </section>

            {/* 7. Security */}
            <section
              id="security"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  07
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Security</h2>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  Telemetry streams and recorded media are protected by defense-in-depth infrastructure standards:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-[#1a3028] flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#2d4a3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" />
                      </svg>
                      Encrypted In Transit &amp; At Rest
                    </span>
                    <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      All WebRTC media connections utilize DTLS/SRTP with TLS 1.3 transport tunnels. Cold storage is secured via AES-256 with rotating HSM-backed keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-[#1a3028] flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#2d4a3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                      </svg>
                      Access Logged for Audit
                    </span>
                    <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Every instance of session replay, proctor playback, or administrative access generates an immutable, cryptographically signed audit log.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Changes to This Policy */}
            <section
              id="changes"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  08
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Changes to This Policy</h2>
              </div>

              <div className="space-y-3 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  We reserve the right to revise this privacy charter to reflect technological enhancements, legislative shifts, and security standard updates.
                </p>
                <p>
                  When material updates occur, ProctorAi will post prominent alerts on the candidate pre-check console and provide notification flags to partner institutional administrators prior to enforcement.
                </p>
              </div>
            </section>

            {/* 9. Contact Information */}
            <section
              id="contact"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  09
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Contact Information</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-5 leading-relaxed">
                For inquiries regarding our algorithmic privacy guarantees, FERPA governance, or data access requests:
              </p>

              <div className="bg-[#2d4a3e] text-white rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#c9ead9] block">Data Protection Officer</span>
                  <p className="text-xs sm:text-sm text-[#e9f0ec]">Reach our security, privacy, and compliance counsel directly.</p>
                  <span className="text-xs font-mono text-white block pt-1">privacy@proctorai.com</span>
                </div>
                <a
                  className="px-4 py-2.5 bg-white text-[#1a3028] font-semibold text-xs rounded-lg hover:bg-[#f0f7f3] transition-colors whitespace-nowrap shadow-xs"
                  href="mailto:privacy@proctorai.com"
                >
                  Email Legal Team
                </a>
              </div>
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
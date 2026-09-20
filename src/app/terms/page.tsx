'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'eligibility', title: 'Eligibility & Authorization' },
  { id: 'before-your-exam', title: 'Before Your Exam' },
  { id: 'during-your-exam', title: 'During Your Exam' },
  { id: 'ai-monitoring', title: 'AI Monitoring & Risk Scoring' },
  { id: 'prohibited-conduct', title: 'Prohibited Conduct' },
  { id: 'technical-issues', title: 'Technical Reliability & Support' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'limitation-of-liability', title: 'Limitation of Liability' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'changes', title: 'Changes to These Terms' },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');

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
              Terms &amp; Conditions
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white tracking-tight font-bold">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#d2e7dc] leading-relaxed">
              The rules, responsibilities, and procedural safeguards that apply when using ProctorAi for online assessments.
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
                <span className="text-[11px] font-mono text-[#708077] font-medium">11 Sections</span>
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

            {/* Fair & Transparent Callout Card */}
            <div className="bg-[#f0f7f3] border border-[#d2dbd5]/60 rounded-xl p-5 shadow-xs flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#1a3028]">
                <svg className="w-5 h-5 text-[#2d4a3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" />
                </svg>
                <span className="text-sm font-bold text-[#1a3028]">Fair &amp; Transparent</span>
              </div>
              <p className="text-xs text-[#3d4d44] leading-relaxed">
                Automated monitoring supports human review. AI-generated telemetry does not independently make disciplinary decisions.
              </p>
            </div>
          </aside>

          {/* Document Content Column */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. Acceptance */}
            <section
              id="acceptance"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  01
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-[#3d4d44] text-sm sm:text-[15px] leading-relaxed">
                <p>
                  By initiating, accessing, or completing an examination session on the ProctorAi platform, you explicitly agree to abide by these Terms of Service, institutional integrity codes, and our linked Privacy Policy.
                </p>
                <p>
                  If you do not agree to these terms or cannot fulfill the technical prerequisites, please do not proceed with your assessment session and immediately notify your academic institution to request alternative examination arrangements.
                </p>
              </div>
            </section>

            {/* 2. Eligibility & Authorization */}
            <section
              id="eligibility"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  02
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Eligibility &amp; Authorization</h2>
              </div>
              <div className="space-y-4 text-[#3d4d44] text-sm sm:text-[15px] leading-relaxed">
                <p>
                  This proctoring system is authorized solely for registered candidates enrolled in scheduled, accredited assessments through partnering educational institutions, licensing boards, and certification authorities.
                </p>
                <p>
                  You must authenticate using valid credentials provided by your institution or an authorized government-issued photo identity document. Impersonation or unauthorized delegation is strictly prohibited.
                </p>
              </div>
            </section>

            {/* 3. Before Your Exam */}
            <section
              id="before-your-exam"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  03
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Before Your Exam</h2>
              </div>
              <p className="text-sm text-[#3d4d44] mb-4 leading-relaxed">
                Prior to launching the assessment, you are responsible for establishing a compliant testing environment:
              </p>

              <div className="space-y-3 text-sm text-[#3d4d44]">
                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[#1a3028] block text-xs sm:text-sm">Hardware &amp; Connectivity:</strong>
                    <span className="text-xs sm:text-sm">Functioning webcam, clear microphone, and a stable broadband internet connection with adequate bandwidth.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[#1a3028] block text-xs sm:text-sm">Environment Setup:</strong>
                    <span className="text-xs sm:text-sm">A quiet, well-illuminated, private room with no unauthorized secondary screens, smartwatches, or companion devices.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[#1a3028] block text-xs sm:text-sm">Calibration &amp; Sweep:</strong>
                    <span className="text-xs sm:text-sm">Completing the guided 360° workspace sweep, showing hand position, and verifying camera angles as requested.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. During Your Exam */}
            <section
              id="during-your-exam"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  04
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">During Your Exam</h2>
              </div>
              <div className="space-y-4 text-[#3d4d44] text-sm sm:text-[15px] leading-relaxed">
                <p>Throughout the duration of your examination, you agree to:</p>
                <ul className="space-y-2.5 text-sm text-[#3d4d44]">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2d4a3e] mt-2 shrink-0" />
                    <span>Remain continuously visible in the camera viewport, except for authorized institution-approved rest intervals.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2d4a3e] mt-2 shrink-0" />
                    <span>Refrain from communicating with external individuals in person, by telephone, or via digital chat tools.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2d4a3e] mt-2 shrink-0" />
                    <span>Respond promptly to in-session system calibration prompts, such as centering your face or clarifying lighting.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 5. AI Monitoring & Risk Scoring */}
            <section
              id="ai-monitoring"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  05
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">AI Monitoring &amp; Risk Scoring</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  ProctorAi deploys computer-vision models to measure gaze vectors, analyze head posture, evaluate acoustic levels, and ensure single-candidate continuity.
                </p>

                <div className="p-4 rounded-xl bg-[#f0f7f3] border border-[#d2dbd5]/40 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eaf1ec] flex items-center justify-center shrink-0 text-[#2d4a3e]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-sm font-bold text-[#1a3028] block mb-1">Human Review Guarantee</strong>
                    <p className="text-xs sm:text-sm text-[#3d4d44] leading-relaxed">
                      Automated risk metrics serve as an evidentiary aid for institutional proctors. An automated anomaly flag is never an autonomous finding of academic misconduct without mandatory human review and verification.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Prohibited Conduct */}
            <section
              id="prohibited-conduct"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  06
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Prohibited Conduct</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>The following activities constitute serious policy violations:</p>
                <ul className="space-y-2.5 text-sm text-[#3d4d44]">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span>Attempting to circumvent, tamper with, or spoof proctoring checks (e.g., virtual cameras, pre-recorded video loops, screen splitting, virtual machines).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span>Copying, broadcasting, photographing, screen-recording, or sharing examination questions and test materials.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                    <span>Accessing unauthorized secondary browser tabs, unauthorized search engines, or AI text generators during closed-book assessments.</span>
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-[#708077] pt-1">
                  Suspected breaches are reported directly to institutional review boards according to your institution&apos;s disciplinary statutes.
                </p>
              </div>
            </section>

            {/* 7. Technical Reliability & Support */}
            <section
              id="technical-issues"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  07
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Technical Reliability &amp; Support</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  While ProctorAi is engineered for 99.98% availability, network interruptions or client-side hardware drops may occasionally occur.
                </p>
                <p>
                  In the event of a sudden connection loss, candidate state is buffered locally. Candidates are encouraged to reconnect promptly and notify their institutional proctor to register timestamps for academic review.
                </p>
              </div>
            </section>

            {/* 8. Intellectual Property */}
            <section
              id="intellectual-property"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  08
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Intellectual Property</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  All proprietary software algorithms, computer-vision pipelines, interface designs, trademarks, and documentation are the exclusive intellectual property of ProctorAi Technologies, Inc.
                </p>
                <p>
                  All examination questions, testing assets, and institutional course materials remain the intellectual property of your academic institution or certifying board.
                </p>
              </div>
            </section>

            {/* 9. Limitation of Liability */}
            <section
              id="limitation-of-liability"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  09
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Limitation of Liability</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  To the maximum extent permitted by applicable law, ProctorAi shall not be held liable for indirect, incidental, punitive, or consequential damages resulting from local network outages, power interruptions, or candidate hardware misconfigurations.
                </p>
              </div>
            </section>

            {/* 10. Governing Law */}
            <section
              id="governing-law"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  10
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Governing Law</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  These Terms shall be interpreted and governed in accordance with the laws of the jurisdiction specified in your institutional licensing agreement, subject to federal and state educational privacy standards.
                </p>
              </div>
            </section>

            {/* 11. Changes to These Terms */}
            <section
              id="changes"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d2dbd5]/40 scroll-mt-24 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#eaf1ec] text-[#1a3028] text-xs font-mono font-bold">
                  11
                </span>
                <h2 className="text-xl sm:text-2xl text-[#1a3028] font-bold">Changes to These Terms</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-[15px] text-[#3d4d44] leading-relaxed">
                <p>
                  We may revise these Terms of Service to incorporate new regulatory requirements or operational improvements. Notice of material changes will be displayed on the platform pre-check interface prior to active exam entry.
                </p>
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
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="bg-[#fbfcf9] text-slate-900 font-sans antialiased selection:bg-[#488c3c] selection:text-white flex flex-col min-h-screen">
      <style>{`
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        .scan-laser {
          animation: scanline 3.5s linear infinite;
        }
        .grid-pattern {
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(72, 140, 60, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(72, 140, 60, 0.05) 1px, transparent 1px);
        }
        .dot-matrix {
          background-image: radial-gradient(rgba(53, 113, 44, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <main className="flex-1">
        {/* BEGIN: HeroSection */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 lg:py-16 overflow-hidden border-b border-[#e4ebe0]">
          {/* Background subtle gradient decor */}
          <div className="absolute inset-0 pointer-events-none grid-pattern opacity-60"></div>
          <div className="absolute -top-40 right-1/4 w-[400px] h-[400px] bg-[#e1f0dd]/60 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#f2f8f0]/70 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Copywriting & Value Prop */}
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e1f0dd]/90 border border-[#c5e2be]/70 text-[#1e3a1b] text-[10px] font-semibold tracking-wide uppercase mb-4 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35712c] animate-ping"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35712c] -ml-3"></span>
                  <span>AI-Verified Assessments • Real-Time Telemetry</span>
                </div>

                {/* Scaled down Headline */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  Know who&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#254720] via-[#2c5924] to-emerald-700">really</span> on the other side of the screen.
                </h1>

                {/* Scaled down Subheadline */}
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mb-6 max-w-md">
                  ProctorAi runs multimodal identity verification, 360° environment inspection, and millisecond-accurate behavioral monitoring — synthesized into an undeniable integrity score your faculty can act on with confidence.
                </p>

                {/* Compact CTA Button Group */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-6">
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-lg bg-[#254720] hover:bg-[#1e3a1b] text-white font-medium text-xs text-center shadow-md shadow-[#1e3a1b]/20 hover:shadow-[0_0_25px_-5px_rgba(72,140,60,0.25)] transition flex items-center justify-center gap-2"
                  >
                    <span>Start Free Assessment Pilot</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </Link>
                  <a
                    className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-medium text-xs text-center shadow-sm transition flex items-center justify-center gap-1.5 group cursor-pointer"
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('features') || document.getElementById('paper-trail');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', '#paper-trail');
                      }
                    }}
                  >
                    <span>See live audit log</span>
                    <span className="text-[#2c5924] group-hover:translate-y-0.5 transition-transform">↓</span>
                  </a>
                </div>

                {/* Institutional Validation Badges */}
                <div className="pt-4 border-t border-slate-200/80 w-full">
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#35712c]" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                      </svg>
                      <span>99.8% Biometric Precision</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#35712c]" fill="currentColor" viewBox="0 0 20 20">
                        <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                      </svg>
                      <span>Zero Software Installs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sleeker HUD Cockpit */}
              <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
                <div className="w-full max-w-[420px] relative">
                  {/* Glow background decorative aura */}
                  <div className="absolute -inset-1 bg-gradient-to-tr from-[#35712c] to-emerald-500 rounded-xl blur-lg opacity-20 group-hover:opacity-35 transition duration-1000"></div>
                  <div className="relative rounded-xl bg-white border border-slate-200/90 shadow-xl overflow-hidden" data-purpose="proctor-hud-mockup">
                    {/* HUD Header Bar */}
                    <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/90"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-500/90"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500/90"></div>
                        <span className="ml-1.5 text-[10px] font-mono text-slate-400">SESSION: #PRC-99420-US</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0d200b] text-emerald-400 border border-[#2c5924]/60 text-[9px] font-mono">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>LIVE</span>
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">30 FPS</div>
                      </div>
                    </div>

                    {/* Main Video Feed Viewport */}
                    <div className="relative bg-slate-950 aspect-[16/10] overflow-hidden flex items-center justify-center">
                      {/* Background Grid within Camera feed */}
                      <div className="absolute inset-0 dot-matrix opacity-20"></div>
                      
                      {/* Laser scanning visual indicator line */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent scan-laser z-20 pointer-events-none"></div>
                      
                      {/* Viewfinder Corner Crosshairs */}
                      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-[#6fae63]/80"></div>
                      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-[#6fae63]/80"></div>
                      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-[#6fae63]/80"></div>
                      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-[#6fae63]/80"></div>
                      
                      {/* Audio Status Pill (Top-Right HUD) */}
                      <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-700 text-[9px] font-mono text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>AUDIO CLEAR</span>
                        <div className="flex items-center gap-0.5 h-2.5 ml-0.5">
                          <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full"></span>
                          <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full"></span>
                          <span className="w-0.5 h-1 bg-emerald-400 rounded-full"></span>
                          <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        </div>
                      </div>

                      {/* Live Face Landmark Detection Silhouette Box */}
                      <div className="relative z-10 flex flex-col items-center">
                        {/* Detection Tag */}
                        <div className="mb-1 inline-flex items-center gap-1 bg-[#1e3a1b]/90 text-[#c5e2be] text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#488c3c]/40">
                          <span>FACE 99.4% CONFIRMED</span>
                        </div>
                        {/* Face Bounding Box with tracking reticle */}
                        <div className="w-24 h-28 rounded-lg border-2 border-dashed border-emerald-400/90 bg-emerald-500/5 relative flex items-center justify-center p-1.5 shadow-[0_0_25px_-5px_rgba(72,140,60,0.25)]">
                          {/* Candidate Silhouette Placeholder */}
                          <div className="w-20 h-24 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-10 h-10 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center shadow-inner">
                              <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                <path clipRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" fillRule="evenodd"></path>
                              </svg>
                            </div>
                            <div className="w-14 h-5 bg-slate-700/60 rounded-t-full mt-1"></div>
                          </div>
                          {/* Gaze Vector Trackers */}
                          <span className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-400 rounded-sm"></span>
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-sm"></span>
                          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-sm"></span>
                          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-400 rounded-sm"></span>
                        </div>
                      </div>

                      {/* Bottom Telemetry Chips inside Viewport */}
                      <div className="absolute bottom-3 left-4 z-20 flex flex-wrap gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700 text-[9px] font-mono text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>GAZE: 98.2%</span>
                        </div>
                        <div className="hidden sm:inline-flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700 text-[9px] font-mono text-slate-200">
                          <svg className="w-2.5 h-2.5 text-[#6fae63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                          </svg>
                          <span>1 MONITOR</span>
                        </div>
                      </div>

                      {/* Composite Risk Score Radial Widget in corner */}
                      <div className="absolute bottom-3 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-md border border-slate-700 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-emerald-400/80 flex items-center justify-center text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/40">
                          98
                        </div>
                        <div className="text-left leading-tight">
                          <div className="text-[8px] font-mono uppercase text-slate-400">Score</div>
                          <div className="text-[10px] font-semibold text-emerald-400">VERIFIED</div>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Event Stream */}
                    <div className="bg-slate-900 p-3 border-t border-slate-800 font-mono text-[11px]">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-sans font-medium uppercase tracking-wider">
                        <span>Telemetry Stream</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                          Sync
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex items-center justify-between hover:bg-slate-800/40 px-1 py-0.5 rounded transition text-[10px]">
                          <span className="text-slate-500">00:00:04</span>
                          <span className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-semibold">SESSION</span>
                          <span className="text-slate-300 flex-1 ml-2 truncate">Recording initialized &amp; encryption handshake OK</span>
                          <span className="text-emerald-400 text-[10px]">✓</span>
                        </div>
                        <div className="flex items-center justify-between hover:bg-slate-800/40 px-1 py-0.5 rounded transition text-[10px]">
                          <span className="text-slate-500">00:00:12</span>
                          <span className="px-1 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[9px] font-semibold">ID</span>
                          <span className="text-slate-300 flex-1 ml-2 truncate">Govt ID photo vs Live Liveness match 99.4%</span>
                          <span className="text-emerald-400 text-[10px]">PASS</span>
                        </div>
                        <div className="flex items-center justify-between hover:bg-slate-800/40 px-1 py-0.5 rounded transition text-[10px]">
                          <span className="text-slate-500">00:00:45</span>
                          <span className="px-1 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[9px] font-semibold">ROOM</span>
                          <span className="text-slate-300 flex-1 ml-2 truncate">360° workspace sweep complete. 0 devices</span>
                          <span className="text-emerald-400 text-[10px]">CLEAR</span>
                        </div>
                        <div className="flex items-center justify-between hover:bg-slate-800/40 px-1 py-0.5 rounded transition text-[10px]">
                          <span className="text-slate-500">00:04:10</span>
                          <span className="px-1 py-0.5 rounded bg-[#1e3a1b]/70 text-[#c5e2be] text-[9px] font-semibold">BEHAVIOR</span>
                          <span className="text-slate-300 flex-1 ml-2 truncate">Gaze steady on viewport, head angles norm</span>
                          <span className="text-emerald-400 text-[10px]">NOMINAL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: PaperTrailAuditSection */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center py-14 lg:py-20 bg-[#edf3ec] border-t border-b border-[#dce6dc] relative scroll-mt-16" id="features">
          <div id="paper-trail" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#d8ebd5] text-[#1e3a1b] font-mono text-[10px] font-semibold tracking-wider uppercase mb-2">
                EVENT LOG ARCHITECTURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                Every session leaves an unshakeable paper trail.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Four independent neural checks run concurrently throughout every assessment. Each event is recorded with millisecond timestamps, cryptographic authenticity hashes, and video-synchronized proof.
              </p>
            </div>

            {/* 3 Bento Grid Cards scaled down */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Identity Checks */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(20,40,25,0.06)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group p-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ID-VERIFY
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-500 group-hover:text-[#2c5924] transition">
                      ≥99.4% match
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#f2f8f0] border border-[#e1f0dd] text-[#254720] flex items-center justify-center group-hover:scale-105 transition-transform w-8 h-8 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5 text-sm">Biometric Identity Assurance</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Instant match against government passports, driver’s licenses, or campus IDs with 3D passive liveness detection to thwart printed photographs, mobile video replays, and deepfake injection.
                  </p>
                </div>
                {/* Mini Spec / Log Sample */}
                <div className="pt-2.5 border-t border-slate-100 font-mono text-[10px] text-slate-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Liveness Test:</span>
                    <span className="text-emerald-700 font-semibold">Active Mesh Passed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OCR Extraction:</span>
                    <span className="text-slate-800">MRZ &amp; Barcode Verified</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Room Scanning */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(20,40,25,0.06)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group p-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      ROOM-SCAN
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-500 group-hover:text-[#2c5924] transition">
                      360° Vision Sweep
                    </span>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform w-8 h-8 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5 text-sm">Environment &amp; Desk Sweeping</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Guided smartphone or webcam scan of the desk surface, under the monitor, and perimeter workspace before kickoff. Detects dual monitors, unauthorized books, earphones, and secondary individuals.
                  </p>
                </div>
                {/* Mini Spec / Log Sample */}
                <div className="pt-2.5 border-t border-slate-100 font-mono text-[10px] text-slate-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Desk Perimeter:</span>
                    <span className="text-emerald-700 font-semibold">Zero Unregistered Hardware</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secondary Presence:</span>
                    <span className="text-slate-800">None (1 Person Isolated)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Behavior Monitoring */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(20,40,25,0.06)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group p-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                      BEHAVIOR
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-500 group-hover:text-[#2c5924] transition">
                      Sub-100ms Telemetry
                    </span>
                  </div>
                  <div className="rounded-lg bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform w-8 h-8 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5 text-sm">Continuous Gaze &amp; Acoustic AI</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Monitors eye vectors, head pitch/yaw/roll, and ambient audio feeds. Isolates background keyboard typing, whispering, virtual machines, tab switches, and unauthorized Bluetooth peripherals.
                  </p>
                </div>
                {/* Mini Spec / Log Sample */}
                <div className="pt-2.5 border-t border-slate-100 font-mono text-[10px] text-slate-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Tab Focus Drift:</span>
                    <span className="text-emerald-700 font-semibold">0 instances (0.00s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acoustic Whisper Filter:</span>
                    <span className="text-slate-800">Clean / Zero Human Speech</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: PaperTrailAuditSection */}

        {/* BEGIN: HowItWorks */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center py-14 lg:py-20 bg-[#edf3ec] border-b border-[#dce6dc] relative scroll-mt-16" id="how-it-works">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#d8ebd5] text-[#1e3a1b] font-mono text-[10px] font-semibold uppercase mb-2">
                SEAMLESS WORKFLOW
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Zero friction for students. Total certitude for faculty.
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Runs natively in modern web browsers without invasive kernel drivers or bloated executable downloads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#c5e2be] via-[#488c3c] to-[#c5e2be] -z-0 top-10"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(20,40,25,0.06)] hover:shadow-lg transition-all p-5">
                <div className="rounded-xl bg-[#f2f8f0] border-2 border-[#2c5924] text-[#254720] flex items-center justify-center font-bold text-sm shadow-xs w-8 h-8 mb-3">
                  01
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">30-Second Onboarding</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Candidate joins exam URL, presents ID card to the webcam, and completes a fast 3D face liveness scan.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(20,40,25,0.06)] hover:shadow-lg transition-all p-5">
                <div className="rounded-xl bg-[#254720] text-white flex items-center justify-center font-bold text-sm shadow-xs w-8 h-8 mb-3">
                  02
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Silent Proctor Guard</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  The AI runs quietly in the browser background. No popups or anxiety-inducing alerts interrupt honest testers.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(20,40,25,0.06)] hover:shadow-lg transition-all p-5">
                <div className="rounded-xl bg-[#f2f8f0] border-2 border-[#2c5924] text-[#254720] flex items-center justify-center font-bold text-sm shadow-xs w-8 h-8 mb-3">
                  03
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Instant Scored Dossier</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Exams finalize directly into Canvas, Blackboard, or Moodle with verified anomaly timestamps and certified PDF summaries.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* END: HowItWorks */}
      </main>

      {/* BEGIN: MainFooter */}
      <footer id="about" className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#1e3a1b] text-[#9ccb92] flex items-center justify-center border border-[#2c5924]/50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <span className="text-base font-bold text-white tracking-tight">Proctor<span className="text-[#6fae63]">Ai</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-3">
                Autonomous multi-modal assessment security engine providing mathematical audit trails and continuous behavioral verification for high-stakes certification bodies and world-class universities.
              </p>
              <div className="font-mono text-[10px] text-slate-500">
                SYSTEM STATUS: <span className="text-emerald-400">● ALL CLUSTERS OPERATIONAL</span>
              </div>
            </div>

            {/* Links Column: Architecture */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-white font-semibold mb-2.5">Architecture</h4>
              <ul className="space-y-1.5 text-xs">
                <li><span className="hover:text-white transition cursor-default">Biometric Verification</span></li>
                <li><span className="hover:text-white transition cursor-default">360° Workspace Sweeper</span></li>
                <li><span className="hover:text-white transition cursor-default">Gaze &amp; Acoustic Engine</span></li>
                <li><span className="hover:text-white transition cursor-default">Zero-Install WASM Core</span></li>
                <li><span className="hover:text-white transition cursor-default">Cryptographic Logs</span></li>
              </ul>
            </div>

            {/* Links Column: Integrations */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-white font-semibold mb-2.5">Integrations</h4>
              <ul className="space-y-1.5 text-xs">
                <li><span className="hover:text-white transition cursor-default">Canvas by Instructure</span></li>
                <li><span className="hover:text-white transition cursor-default">Blackboard Learn Ultra</span></li>
                <li><span className="hover:text-white transition cursor-default">Moodle Enterprise</span></li>
                <li><span className="hover:text-white transition cursor-default">D2L Brightspace</span></li>
                <li><span className="hover:text-white transition cursor-default">Custom REST &amp; Webhooks</span></li>
              </ul>
            </div>

            {/* Links Column: Compliance */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-white font-semibold mb-2.5">Compliance</h4>
              <ul className="space-y-1.5 text-xs">
                <li><span className="hover:text-white transition cursor-default">FERPA Data Privacy</span></li>
                <li><span className="hover:text-white transition cursor-default">GDPR Candidate Rights</span></li>
                <li><span className="hover:text-white transition cursor-default">SOC 2 Type II Reports</span></li>
                <li><span className="hover:text-white transition cursor-default">Biometric Retention Policy</span></li>
                <li><span className="hover:text-white transition cursor-default">Vulnerability Disclosure</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <div>
              © 2025 ProctorAi Technologies, Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-5">
              <Link className="font-bold text-slate-300 hover:text-white transition" href="/privacy">Privacy Policy</Link>
              <Link className="font-bold text-slate-300 hover:text-white transition" href="/terms">Terms of Service</Link>
              <Link className="font-bold text-slate-300 hover:text-white transition" href="/security">Security Overview</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
}
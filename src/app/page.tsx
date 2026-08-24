'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-light px-3.5 py-1.5 text-xs font-semibold text-brand-green border border-brand-green-border mb-6">
              <span>Next-Gen Proctoring System</span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-ping"></span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
              AI-Powered Exam Proctoring Redefined
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Ensure academic and professional integrity with ProctorAI. Real-time face verification, 360-degree room scans, object detection, head gaze monitoring, and smart risk scoring.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <span className="text-sm font-medium text-neutral-500">
                    Logged in as <span className="font-semibold text-neutral-800">{user?.email}</span>
                  </span>
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-lg border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-t border-neutral-100 bg-neutral-50/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-brand-green">Advanced Capabilities</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Everything you need to secure your assessments
            </p>
          </div>
          
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            
            {/* Feature 1 */}
            <div className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-light text-brand-green mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Identity Checks</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Face verification, match confidence scoring, and multi-factor liveness testing to prevent candidate impersonation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-light text-brand-green mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Room Scanning</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                AI verification verifies desk space and enforces full-room sweeps to detect prohibited materials or third-party help.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-light text-brand-green mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Behavior Monitoring</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Gaze tracking, phone/headphone detection, and voice monitoring catch tab switches or unexpected background audio.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-light text-brand-green mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Risk Profiling</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Unified scoring metrics generate risk breakdowns, highlighting incidents categorized by severity levels.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works / About Section */}
      <section id="about" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-brand-green">Seamless Integration</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">How ProctorAI Protects Exams</h2>
              <p className="mt-6 text-lg leading-8 text-neutral-600">
                We designed ProctorAI to work natively inside the candidate&apos;s browser without requiring complex software installations.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-neutral-600">
                <div className="relative pl-9">
                  <dt className="inline font-bold text-neutral-900">
                    <svg className="absolute left-1 top-1 h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    1. Create & Customize:
                  </dt>{' '}
                  <dd className="inline">Create assessment templates and toggle specific monitoring rules like object detection or fullscreen lock.</dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-bold text-neutral-900">
                    <svg className="absolute left-1 top-1 h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    2. Invite Candidates:
                  </dt>{' '}
                  <dd className="inline">Send secure email invitation links. Candidates complete identity checks and room validation.</dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-bold text-neutral-900">
                    <svg className="absolute left-1 top-1 h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    3. AI Active Tracking:
                  </dt>{' '}
                  <dd className="inline">Our lightweight computer vision models trace active violations (e.g. phones, gazes, voices) and log telemetry.</dd>
                </div>
              </dl>
            </div>
            
            {/* Visual Box */}
            <div className="flex items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 p-8 lg:p-12 lg:h-[400px]">
              <div className="text-center space-y-4 max-w-sm">
                <svg className="mx-auto h-16 w-16 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="font-bold text-neutral-800 text-lg">Webcam Monitoring Feed</h3>
                <p className="text-neutral-500 text-sm">
                  Simulated live video proctor feed overlaying real-time bounding boxes (Face, Cellphone, Document check).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

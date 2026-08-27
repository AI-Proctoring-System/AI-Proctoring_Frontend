'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const sections = [
    'Overview',
    'What We Collect',
    'Why We Collect It',
    'What We Don’t Do',
    'Data Retention',
    'Your Rights',
    'Security',
    'Changes to This Policy',
    'Contact',
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-neutral-50/70">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-green-light/60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-brand-green-light/40 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green-border bg-white/80 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-green shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              Your privacy matters
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
              How ProctorAI collects, processes, protects, and retains information
              during online assessments.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-500 shadow-sm">
              <svg
                aria-hidden="true"
                className="h-4 w-4 text-brand-green"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Last updated: August 25, 2026
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                On this page
              </p>

              <nav className="border-l border-neutral-200">
                {sections.map((section, index) => (
                  <a
                    key={section}
                    href={`#section-${index + 1}`}
                    className="group relative block border-l-2 border-transparent px-4 py-2 text-xs leading-5 text-neutral-500 transition-all hover:border-brand-green hover:bg-brand-green-light/40 hover:text-brand-green"
                  >
                    <span className="mr-2 font-mono text-[10px] text-neutral-300 group-hover:text-brand-green">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section}
                  </a>
                ))}
              </nav>

              <div className="mt-8 rounded-xl border border-brand-green-border bg-brand-green-light/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-green shadow-sm">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-900">
                      Privacy first
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-neutral-500">
                      Your assessment data is handled only for exam integrity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy */}
          <article className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]">
              <div className="divide-y divide-neutral-100">
                {/* Overview */}
                <section
                  id="section-1"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="01" title="Overview" />

                  <p className="mt-6 text-[15px] leading-8 text-neutral-600">
                    ProctorAI is an AI-assisted proctoring system used to monitor
                    and verify candidates during online assessments for your
                    institution. This policy explains what data we collect during
                    an exam session, why we collect it, how it&apos;s processed,
                    and what rights you have over it.
                  </p>
                </section>

                {/* What We Collect */}
                <section
                  id="section-2"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="02" title="What We Collect" />

                  <PolicyList>
                    <li>
                      <strong>Video feed</strong> from your webcam for the
                      duration of the exam and the pre-exam setup checklist.
                    </li>
                    <li>
                      <strong>Room-scan images</strong> captured while you pan
                      your camera around your room (walls, desk, chair, and
                      entrance door) during setup.
                    </li>
                    <li>
                      <strong>Derived biometric signals</strong> — head pose,
                      eye/gaze direction, and hand position — computed from your
                      video feed. These are numeric measurements (angles,
                      coordinates), not stored as raw biometric templates beyond
                      what&apos;s needed to compute your session&apos;s risk score.
                    </li>
                    <li>
                      <strong>A face verification embedding</strong> used once at
                      the start of your session to confirm your identity against
                      your registered photo/ID, and periodically during the exam
                      to confirm you remain the same person.
                    </li>
                    <li>
                      <strong>Audio</strong>, if microphone monitoring is
                      enabled, used only to detect whether talking is occurring
                      (not transcribed or interpreted for content unless
                      explicitly stated for your exam).
                    </li>
                    <li>
                      <strong>Device and session metadata</strong> — browser type,
                      timestamps, connection status, and exam session ID.
                    </li>
                  </PolicyList>
                </section>

                {/* Why We Collect It */}
                <section
                  id="section-3"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="03" title="Why We Collect It" />

                  <PolicyList>
                    <li>To verify you are the registered candidate.</li>
                    <li>
                      To confirm your exam environment meets the integrity
                      requirements (no phone, no unauthorized person, no second
                      screen, clear desk).
                    </li>
                    <li>
                      To generate a risk score flagging moments that may need
                      human review (e.g., prolonged looking away, a phone
                      detected, another voice heard).
                    </li>
                    <li>
                      To generate the exam recording and report made available
                      to your institution&apos;s exam reviewers.
                    </li>
                  </PolicyList>
                </section>

                {/* What We Don't Do */}
                <section
                  id="section-4"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="04" title="What We Don&apos;t Do" />

                  <PolicyList>
                    <li>
                      We do not send your video or room-scan images to
                      third-party AI services. Face, gaze, hand, and
                      room-verification analysis run on servers we control.
                    </li>
                    <li>
                      We do not use your data for advertising, profiling outside
                      the exam context, or any purpose unrelated to exam
                      integrity.
                    </li>
                    <li>
                      Automated flags are never treated as final. Every flagged
                      moment is reviewed by a human (instructor/TA) before it
                      affects your result.
                    </li>
                  </PolicyList>
                </section>

                {/* Data Retention */}
                <section
                  id="section-5"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="05" title="Data Retention" />

                  <PolicyList>
                    <li>
                      Exam recordings and risk reports are retained for{' '}
                      <strong>
                        until the end of the grade-appeal window, then 90 days
                      </strong>
                      , after which they are deleted.
                    </li>
                    <li>
                      Room-scan images are used only to complete the pre-exam
                      checklist and are not retained after your session is
                      verified, unless flagged as part of a risk report.
                    </li>
                  </PolicyList>
                </section>

                {/* Your Rights */}
                <section
                  id="section-6"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="06" title="Your Rights" />

                  <PolicyList>
                    <li>
                      You may request a copy of your session&apos;s risk report
                      and the reasoning behind any flag.
                    </li>
                    <li>
                      You may request correction of inaccurate information tied
                      to your session.
                    </li>
                    <li>
                      You may request early deletion of your recording once the
                      appeal window for that exam has closed.
                    </li>
                    <li>
                      Requests can be sent to{' '}
                      <strong>privacy@proctorai.com</strong>.
                    </li>
                  </PolicyList>
                </section>

                {/* Security */}
                <section
                  id="section-7"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="07" title="Security" />

                  <p className="mt-6 text-[15px] leading-8 text-neutral-600">
                    Recordings and derived data are encrypted in transit and at
                    rest. Access is limited to authorized reviewers
                    (instructors, designated TAs, and system administrators) and
                    logged for audit purposes.
                  </p>

                  <div className="mt-8 flex items-center gap-3 rounded-xl border border-brand-green-border bg-brand-green-light/30 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-green shadow-sm">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      </svg>
                    </div>

                    <span className="text-xs font-medium text-neutral-700">
                      Data is encrypted in transit and at rest.
                    </span>
                  </div>
                </section>

                {/* Changes */}
                <section
                  id="section-8"
                  className="scroll-mt-8 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader
                    number="08"
                    title="Changes to This Policy"
                  />

                  <p className="mt-6 text-[15px] leading-8 text-neutral-600">
                    We&apos;ll post the updated date at the top of this page
                    whenever this policy changes. Material changes will be
                    communicated before your next exam session.
                  </p>
                </section>

                {/* Contact */}
                <section
                  id="section-9"
                  className="scroll-mt-8 bg-neutral-50/70 p-8 sm:p-10 lg:p-12"
                >
                  <SectionHeader number="09" title="Contact" />

                  <p className="mt-6 text-[15px] leading-8 text-neutral-600">
                    Questions about this policy:{' '}
                    <a
                      href="mailto:privacy@proctorai.com"
                      className="font-semibold text-brand-green underline decoration-brand-green-border underline-offset-4 transition hover:decoration-brand-green"
                    >
                      privacy@proctorai.com
                    </a>
                  </p>

                  <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
                          <path d="m22 6-10 7L2 6" />
                        </svg>
                      </div>

                      <div>
                        <p className="font-semibold text-neutral-900">
                          Need help?
                        </p>

                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                          Our privacy team can answer questions about your
                          assessment data and privacy rights.
                        </p>

                        <a
                          href="mailto:privacy@proctorai.com"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline"
                        >
                          Contact privacy team
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-xs text-neutral-400">
                © 2026 ProctorAI. Privacy and transparency by design.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium text-neutral-600 shadow-sm transition hover:border-brand-green-border hover:text-brand-green"
              >
                <span aria-hidden="true">←</span>
                Back to ProctorAI
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-1 flex h-8 min-w-8 items-center justify-center rounded-lg bg-brand-green-light px-2 font-mono text-[10px] font-bold tracking-wide text-brand-green">
        {number}
      </span>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          {title}
        </h2>

        <div className="mt-3 h-0.5 w-10 rounded-full bg-brand-green" />
      </div>
    </div>
  );
}

function PolicyList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-6 space-y-4">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<{ children?: React.ReactNode; className?: string }>(child)) {
          return null;
        }

        return React.cloneElement(child, {
          className:
            'group flex gap-4 text-[15px] leading-8 text-neutral-600',
          children: (
            <>
              <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green transition-transform group-hover:scale-125" />
              <span>{child.props.children}</span>
            </>
          ),
        });
      })}
    </ul>
  );
}
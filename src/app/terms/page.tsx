'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const sections = [
    'Acceptance',
    'Eligibility',
    'Before Your Exam',
    'During Your Exam',
    'AI Monitoring & Risk Scoring',
    'Prohibited Conduct',
    'Technical Issues',
    'Intellectual Property',
    'Limitation of Liability',
    'Governing Law',
    'Changes',
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
              Terms &amp; conditions
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Terms of Service
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
              The rules and responsibilities that apply when using ProctorAI
              for online assessments.
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
                    className="group block border-l-2 border-transparent px-4 py-2 text-xs leading-5 text-neutral-500 transition-all hover:border-brand-green hover:bg-brand-green-light/40 hover:text-brand-green"
                  >
                    <span className="mr-2 font-mono text-[10px] text-neutral-300 transition-colors group-hover:text-brand-green">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section}
                  </a>
                ))}
              </nav>

              {/* Info card */}
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
                      Fair &amp; transparent
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-neutral-500">
                      Automated monitoring supports human review and does not
                      independently determine misconduct.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Terms content */}
          <article className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]">
              <div className="divide-y divide-neutral-100">
                {/* 1 */}
                <PolicySection
                  id="section-1"
                  number="01"
                  title="Acceptance"
                >
                  <p>
                    By starting an exam session on ProctorAI, you agree to
                    these Terms. If you do not agree, do not proceed with the
                    exam session — contact your institution for alternative
                    arrangements.
                  </p>
                </PolicySection>

                {/* 2 */}
                <PolicySection
                  id="section-2"
                  number="02"
                  title="Eligibility"
                >
                  <p>
                    This platform is available only to registered candidates
                    of your institution for their scheduled assessments.
                  </p>
                </PolicySection>

                {/* 3 */}
                <PolicySection
                  id="section-3"
                  number="03"
                  title="Before Your Exam"
                >
                  <p>You are responsible for:</p>

                  <PolicyList>
                    <li>
                      A working webcam, microphone, and stable internet
                      connection.
                    </li>
                    <li>
                      A quiet, well-lit room with your entrance door visible
                      from your seat.
                    </li>
                    <li>
                      Completing the pre-exam checklist honestly: showing and
                      removing your phone, showing your hands/desk/chair, and
                      completing the guided room scan when prompted by the AI
                      agent.
                    </li>
                    <li>
                      Ensuring no unauthorized person, device, or material is
                      present in your exam environment.
                    </li>
                  </PolicyList>
                </PolicySection>

                {/* 4 */}
                <PolicySection
                  id="section-4"
                  number="04"
                  title="During Your Exam"
                >
                  <p>You agree to:</p>

                  <PolicyList>
                    <li>
                      Remain visible in the camera frame for the duration of
                      the exam, except for permitted breaks (see Support page).
                    </li>
                    <li>
                      Follow any in-session instructions from the AI agent
                      (e.g., re-showing your hands if prompted).
                    </li>
                    <li>
                      Not use a phone, smartwatch, second screen, notes, or
                      communication with another person unless explicitly
                      permitted for your exam.
                    </li>
                  </PolicyList>
                </PolicySection>

                {/* 5 */}
                <PolicySection
                  id="section-5"
                  number="05"
                  title="AI Monitoring & Risk Scoring"
                >
                  <p>
                    ProctorAI uses computer-vision and AI models to monitor
                    head/eye movement, detect objects (such as phones), verify
                    your identity, and compute a risk score for your session.{' '}
                    <strong>
                      An automated flag is not a finding of misconduct.
                    </strong>{' '}
                    All flagged moments are reviewed by a human evaluator
                    before any action is taken, and you have the right to
                    appeal (see FAQ).
                  </p>

                  <div className="mt-8 rounded-xl border border-brand-green-border bg-brand-green-light/30 p-5">
                    <div className="flex items-start gap-3">
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
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          Human review matters
                        </p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                          AI-generated flags are reviewed by a human evaluator
                          before they can affect an assessment outcome.
                        </p>
                      </div>
                    </div>
                  </div>
                </PolicySection>

                {/* 6 */}
                <PolicySection
                  id="section-6"
                  number="06"
                  title="Prohibited Conduct"
                >
                  <PolicyList>
                    <li>
                      Attempting to spoof, obstruct, or bypass any proctoring
                      check (e.g., pre-recorded video loops, blocking the
                      camera, impersonation).
                    </li>
                    <li>
                      Leaving the exam environment without permission.
                    </li>
                    <li>
                      Any form of academic dishonesty as defined by your
                      institution&apos;s academic integrity policy.
                    </li>
                  </PolicyList>

                  <p className="mt-6">
                    Violations may result in exam invalidation and referral to
                    your institution&apos;s academic integrity process,
                    governed by your institution&apos;s policies — not solely
                    by this platform&apos;s automated output.
                  </p>
                </PolicySection>

                {/* 7 */}
                <PolicySection
                  id="section-7"
                  number="07"
                  title="Technical Issues"
                >
                  <p>
                    We do not guarantee uninterrupted service. If you
                    experience a technical failure during your exam, contact
                    support immediately (see Support page) and document the
                    issue where possible (e.g., screenshot, timestamp).
                  </p>
                </PolicySection>

                {/* 8 */}
                <PolicySection
                  id="section-8"
                  number="08"
                  title="Intellectual Property"
                >
                  <p>
                    Exam content, questions, and platform software remain the
                    property of your institution / ProctorAI and may not be
                    copied, distributed, or reused.
                  </p>
                </PolicySection>

                {/* 9 */}
                <PolicySection
                  id="section-9"
                  number="09"
                  title="Limitation of Liability"
                >
                  <p>
                    ProctorAI is provided &quot;as is.&quot; Your institution
                    is not liable for indirect or consequential damages arising
                    from technical interruptions, except as required by
                    applicable law.
                  </p>
                </PolicySection>

                {/* 10 */}
                <PolicySection
                  id="section-10"
                  number="10"
                  title="Governing Law"
                >
                  <p>
                    These Terms are governed by the laws of Islamic Republic of
                    Pakistan, under the jurisdiction of your institution.
                  </p>
                </PolicySection>

                {/* 11 */}
                <PolicySection
                  id="section-11"
                  number="11"
                  title="Changes"
                >
                  <p>
                    We may update these Terms periodically. Continued use of
                    the platform after changes constitutes acceptance.
                  </p>
                </PolicySection>
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-xs text-neutral-400">
                © 2026 ProctorAI. Terms and transparency by design.
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

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 p-8 sm:p-10 lg:p-12">
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

      <div className="mt-6 text-[15px] leading-8 text-neutral-600">
        {children}
      </div>
    </section>
  );
}

function PolicyList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-4 space-y-4">
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
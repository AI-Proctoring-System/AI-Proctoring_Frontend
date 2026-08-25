'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-neutral-50/50 border-b border-neutral-100 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl font-display">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Last updated: August 25, 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <div className="prose prose-neutral prose-lg max-w-none text-neutral-600 space-y-12">
          
          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance</h3>
            <p>
              By starting an exam session on ProctorAI, you agree to these Terms. If you do not agree, do not proceed with the exam session — contact your institution for alternative arrangements.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">2. Eligibility</h3>
            <p>
              This platform is available only to registered candidates of your institution for their scheduled assessments.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">3. Before Your Exam</h3>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>A working webcam, microphone, and stable internet connection.</li>
              <li>A quiet, well-lit room with your entrance door visible from your seat.</li>
              <li>Completing the pre-exam checklist honestly: showing and removing your phone, showing your hands/desk/chair, and completing the guided room scan when prompted by the AI agent.</li>
              <li>Ensuring no unauthorized person, device, or material is present in your exam environment.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">4. During Your Exam</h3>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Remain visible in the camera frame for the duration of the exam, except for permitted breaks (see Support page).</li>
              <li>Follow any in-session instructions from the AI agent (e.g., re-showing your hands if prompted).</li>
              <li>Not use a phone, smartwatch, second screen, notes, or communication with another person unless explicitly permitted for your exam.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">5. AI Monitoring & Risk Scoring</h3>
            <p>
              ProctorAI uses computer-vision and AI models to monitor head/eye movement, detect objects (such as phones), verify your identity, and compute a risk score for your session. <strong>An automated flag is not a finding of misconduct.</strong> All flagged moments are reviewed by a human evaluator before any action is taken, and you have the right to appeal (see FAQ).
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">6. Prohibited Conduct</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Attempting to spoof, obstruct, or bypass any proctoring check (e.g., pre-recorded video loops, blocking the camera, impersonation).</li>
              <li>Leaving the exam environment without permission.</li>
              <li>Any form of academic dishonesty as defined by your institution&apos;s academic integrity policy.</li>
            </ul>
            <p className="mt-4">
              Violations may result in exam invalidation and referral to your institution&apos;s academic integrity process, governed by your institution&apos;s policies — not solely by this platform&apos;s automated output.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">7. Technical Issues</h3>
            <p>
              We do not guarantee uninterrupted service. If you experience a technical failure during your exam, contact support immediately (see Support page) and document the issue where possible (e.g., screenshot, timestamp).
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">8. Intellectual Property</h3>
            <p>
              Exam content, questions, and platform software remain the property of your institution / ProctorAI and may not be copied, distributed, or reused.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">9. Limitation of Liability</h3>
            <p>
              ProctorAI is provided &quot;as is.&quot; Your institution is not liable for indirect or consequential damages arising from technical interruptions, except as required by applicable law.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">10. Governing Law</h3>
            <p>
              These Terms are governed by the laws of Islamic Republic of Pakistan, under the jurisdiction of your institution.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">11. Changes</h3>
            <p>
              We may update these Terms periodically. Continued use of the platform after changes constitutes acceptance.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-neutral-50/50 border-b border-neutral-100 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl font-display">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Last updated: August 25, 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <div className="prose prose-neutral prose-lg max-w-none text-neutral-600 space-y-12">
          
          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Overview</h3>
            <p>
              ProctorAI is an AI-assisted proctoring system used to monitor and verify candidates during online assessments for your institution. This policy explains what data we collect during an exam session, why we collect it, how it&apos;s processed, and what rights you have over it.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">What We Collect</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Video feed</strong> from your webcam for the duration of the exam and the pre-exam setup checklist.</li>
              <li><strong>Room-scan images</strong> captured while you pan your camera around your room (walls, desk, chair, and entrance door) during setup.</li>
              <li><strong>Derived biometric signals</strong> — head pose, eye/gaze direction, and hand position — computed from your video feed. These are numeric measurements (angles, coordinates), not stored as raw biometric templates beyond what&apos;s needed to compute your session&apos;s risk score.</li>
              <li><strong>A face verification embedding</strong> used once at the start of your session to confirm your identity against your registered photo/ID, and periodically during the exam to confirm you remain the same person.</li>
              <li><strong>Audio</strong>, if microphone monitoring is enabled, used only to detect whether talking is occurring (not transcribed or interpreted for content unless explicitly stated for your exam).</li>
              <li><strong>Device and session metadata</strong> — browser type, timestamps, connection status, and exam session ID.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Why We Collect It</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>To verify you are the registered candidate.</li>
              <li>To confirm your exam environment meets the integrity requirements (no phone, no unauthorized person, no second screen, clear desk).</li>
              <li>To generate a risk score flagging moments that may need human review (e.g., prolonged looking away, a phone detected, another voice heard).</li>
              <li>To generate the exam recording and report made available to your institution&apos;s exam reviewers.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">What We Don&apos;t Do</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not send your video or room-scan images to third-party AI services. Face, gaze, hand, and room-verification analysis run on servers we control.</li>
              <li>We do not use your data for advertising, profiling outside the exam context, or any purpose unrelated to exam integrity.</li>
              <li>Automated flags are never treated as final. Every flagged moment is reviewed by a human (instructor/TA) before it affects your result.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Data Retention</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Exam recordings and risk reports are retained for <strong>until the end of the grade-appeal window, then 90 days</strong>, after which they are deleted.</li>
              <li>Room-scan images are used only to complete the pre-exam checklist and are not retained after your session is verified, unless flagged as part of a risk report.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Your Rights</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may request a copy of your session&apos;s risk report and the reasoning behind any flag.</li>
              <li>You may request correction of inaccurate information tied to your session.</li>
              <li>You may request early deletion of your recording once the appeal window for that exam has closed.</li>
              <li>Requests can be sent to <strong>privacy@proctorai.com</strong>.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Security</h3>
            <p>
              Recordings and derived data are encrypted in transit and at rest. Access is limited to authorized reviewers (instructors, designated TAs, and system administrators) and logged for audit purposes.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h3>
            <p>
              We&apos;ll post the updated date at the top of this page whenever this policy changes. Material changes will be communicated before your next exam session.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Contact</h3>
            <p>
              Questions about this policy: <a href="mailto:privacy@proctorai.com" className="text-brand-green font-medium hover:underline">privacy@proctorai.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

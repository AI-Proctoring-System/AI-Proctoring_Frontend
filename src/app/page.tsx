'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const events = [
  { t: '00:00:04', type: 'SESSION', detail: 'Recording started' },
  { t: '00:00:12', type: 'IDENTITY', detail: 'Face match 98.2%' },
  { t: '00:00:45', type: 'ROOM', detail: '360° scan complete' },
  { t: '00:04:10', type: 'GAZE', detail: 'On-screen' },
  { t: '00:07:32', type: 'AUDIO', detail: 'Ambient noise nominal' },
  { t: '00:11:58', type: 'OBJECT', detail: 'No devices in frame' },
  { t: '00:16:20', type: 'GAZE', detail: 'Brief look-away — 2s' },
  { t: '00:20:00', type: 'RISK', detail: 'Score updated — 8 / 100' },
];

const checks = [
  {
    code: 'ID-VERIFY',
    title: 'Identity Checks',
    desc: "Face verification against the candidate's ID photo, with liveness testing to catch photos, screens, and stand-ins.",
    metric: '≥95% match',
  },
  {
    code: 'ROOM-SCAN',
    title: 'Room Scanning',
    desc: 'A guided sweep of the desk and surrounding space before the session starts, flagging notes, extra screens, or a second person in frame.',
    metric: '360° sweep',
  },
  {
    code: 'BEHAVIOR',
    title: 'Behavior Monitoring',
    desc: 'Continuous gaze, head-pose, and audio tracking flags tab switches, phones, headphones, or unexpected voices mid-session.',
    metric: 'real-time',
  },
  {
    code: 'RISK-SCORE',
    title: 'Risk Profiling',
    desc: 'Every flagged event rolls into one weighted score per candidate, so reviewers know exactly where to look first.',
    metric: '0–100 scale',
  },
];

const checkpoints = [
  {
    time: '00:00',
    title: 'Identity & Setup',
    desc: 'Candidate verifies their ID and completes a liveness check before the assessment unlocks.',
  },
  {
    time: '00:02',
    title: 'Room Scan',
    desc: 'A guided 360° sweep of the desk and surrounding space, recorded for review.',
  },
  {
    time: '00:05–00:55',
    title: 'Live Assessment',
    desc: 'Gaze, audio, and object detection run continuously in the background.',
  },
  {
    time: '01:00',
    title: 'Report Ready',
    desc: 'A scored, timestamped report is ready for your team as soon as the session ends.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-green-light opacity-60 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand-green">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse motion-reduce:animate-none" />
              AI-verified assessments
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
              Know who&apos;s really on the other side of the screen.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
              ProctorAI runs identity verification, room scanning, and behavior
              monitoring on every remote assessment — then rolls it all into
              one risk score your team can actually act on.
            </p>

            <a
              href="#features"
              className="mt-8 inline-flex items-center gap-1.5 font-mono text-sm text-brand-green underline decoration-brand-green-border decoration-2 underline-offset-4 hover:decoration-brand-green"
            >
              See what gets logged
              <span aria-hidden>↓</span>
            </a>
          </div>

          {/* Signature visual: monitoring frame */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-green-border bg-brand-green-light/40">
              {/* corner brackets */}
              {[
                'left-3 top-3 border-l-2 border-t-2',
                'right-3 top-3 border-r-2 border-t-2',
                'left-3 bottom-3 border-l-2 border-b-2',
                'right-3 bottom-3 border-r-2 border-b-2',
              ].map((pos, i) => (
                <span
                  key={i}
                  className={`absolute h-5 w-5 border-brand-green ${pos}`}
                />
              ))}

              {/* silhouette */}
              <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
                <div className="mx-auto h-14 w-14 rounded-full bg-brand-green-border/70" />
                <div className="mx-auto -mt-2 h-10 w-24 rounded-t-full bg-brand-green-border/70" />
              </div>

              {/* bounding box on head */}
              <div className="absolute left-1/2 top-[30%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-brand-green">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-brand-green px-1.5 py-0.5 font-mono text-[10px] text-white">
                  FACE 98.2%
                </span>
              </div>

              {/* scan line */}
              <div className="absolute inset-x-3 h-px bg-brand-green/70 animate-[scan-sweep_4s_ease-in-out_infinite] motion-reduce:[animation:none]" />

              {/* status pills */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-brand-green-border bg-white/90 px-2.5 py-1 font-mono text-[10px] text-brand-green shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                GAZE ON-SCREEN
              </div>
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-brand-green-border bg-white/90 px-2.5 py-1 font-mono text-[10px] text-brand-green shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                AUDIO CLEAR
              </div>
            </div>

            {/* event ticker */}
            <div className="relative mt-4 h-32 overflow-hidden rounded-xl border border-brand-green-border bg-white">
              <div className="animate-[ticker-scroll_18s_linear_infinite] motion-reduce:[animation:none]">
                {[...events, ...events].map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2 font-mono text-[11px] text-neutral-500"
                  >
                    <span className="text-neutral-400">{e.t}</span>
                    <span className="font-semibold text-brand-green">{e.type}</span>
                    <span className="truncate text-neutral-600">{e.detail}</span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Evidence log (was: Features grid) */}
      <section id="features" className="border-t border-neutral-100 bg-neutral-50/50 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-green">Event log</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Every session leaves a paper trail.
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Four independent checks run in parallel through every assessment,
              each one logged with a timestamp and a confidence score.
            </p>
          </div>

          <div className="divide-y divide-brand-green-border border-t border-brand-green-border">
            {checks.map((c) => (
              <div
                key={c.code}
                className="flex flex-col gap-2 py-8 sm:flex-row sm:items-start sm:gap-8"
              >
                <div className="sm:w-40 sm:shrink-0">
                  <span className="inline-block rounded-md bg-brand-green-light px-2.5 py-1 font-mono text-[11px] tracking-wide text-brand-green">
                    {c.code}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-900">{c.title}</h3>
                  <p className="mt-1.5 text-neutral-600">{c.desc}</p>
                </div>
                <div className="font-mono text-xs text-neutral-400 sm:w-28 sm:shrink-0 sm:text-right">
                  {c.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session timeline (was: How it Works / About) */}
      <section id="about" className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-green">Session timeline</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              One recording, four checkpoints.
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Candidates never leave their browser. The session is captured
              start to finish and broken into checkpoints your team can jump
              straight to.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-6">
            {checkpoints.map((cp) => (
              <div
                key={cp.title}
                className="relative border-l-2 border-brand-green-border pl-5 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-6"
              >
                <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-brand-green sm:hidden" />
                <span className="absolute -top-[5px] left-0 hidden h-2 w-2 rounded-full bg-brand-green sm:block" />
                <p className="font-mono text-xs text-neutral-400">{cp.time}</p>
                <h3 className="mt-2 font-bold text-neutral-900">{cp.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{cp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
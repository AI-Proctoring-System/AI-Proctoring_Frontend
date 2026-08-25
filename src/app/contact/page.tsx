'use client';

import React, { useState } from 'react';
import Link from 'next/link';

function AccordionItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        isOpen ? 'bg-white border border-neutral-200 shadow-sm' : 'bg-neutral-50/80 border border-transparent hover:bg-neutral-100/70'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-neutral-900 pr-4">{question}</span>
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
            isOpen ? 'bg-neutral-100 text-neutral-500' : 'bg-white text-neutral-900 shadow-sm border border-neutral-100'
          }`}
        >
          {isOpen ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-sm text-neutral-600 leading-relaxed border-t border-neutral-50 pt-4 mt-2">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const faqs = [
    {
      category: 'General',
      items: [
        {
          question: 'What is ProctorAI?',
          answer: 'An AI-assisted proctoring system that verifies your identity and monitors your exam environment to help maintain academic integrity during remote assessments.',
        },
        {
          question: 'Is my exam session recorded?',
          answer: 'Yes. Video (and audio, if enabled for your exam) is recorded for the duration of the session and reviewed only if a risk flag requires it, or as required by your institution\'s exam policy.',
        },
        {
          question: 'Who can see my recording?',
          answer: 'Only authorized reviewers at your institution — typically your instructor and designated TAs — plus system administrators for technical support purposes.',
        },
      ],
    },
    {
      category: 'Setup & Technical',
      items: [
        {
          question: 'What do I need before starting?',
          answer: 'A working webcam and microphone, stable internet, a quiet well-lit room, and your entrance door visible from your seat.',
        },
        {
          question: 'Why do I need to show my phone and then put it away?',
          answer: 'This confirms you don\'t have unauthorized access to a phone during the exam. The AI agent will ask you to place it out of reach before continuing.',
        },
        {
          question: 'Why do I need to scan my room?',
          answer: 'The room scan confirms there\'s no unauthorized second person, second screen, or prohibited material in your environment, and verifies the room layout meets exam requirements.',
        },
        {
          question: 'What if I don\'t have a door visible from a typical seating position?',
          answer: 'Contact support before your exam to arrange an approved alternative seating setup — this is a common situation and can be pre-approved rather than causing a flag on exam day.',
        },
        {
          question: 'What if my camera or microphone isn\'t detected?',
          answer: 'Run the system check tool before your exam. If issues persist on exam day, contact the exam-day emergency channel immediately rather than attempting the exam without a working camera.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      items: [
        {
          question: 'Is my data shared with any third party?',
          answer: 'No. Face, gaze, hand, and room-verification AI models run on servers we operate directly — your video is not sent to external AI providers.',
        },
        {
          question: 'How long is my data kept?',
          answer: 'Recordings are retained for the duration of the grade-appeal window plus 90 days and then deleted, unless part of an active appeal or misconduct review.',
        },
        {
          question: 'Can I request my data be deleted?',
          answer: 'Yes, once the appeal window for your exam has closed. Email privacy@proctorai.com.',
        },
      ],
    },
    {
      category: 'Flags & Risk Scores',
      items: [
        {
          question: 'Will an AI flag automatically fail me?',
          answer: 'No. Flags are reviewed by a human instructor or TA before any action is taken. The AI only surfaces moments for review — it does not make the final decision.',
        },
        {
          question: 'What kinds of things get flagged?',
          answer: 'Examples include: prolonged looking away from the screen, a phone detected in frame, more than one face detected, or a voice other than your own being heard. A single brief instance (e.g., a quick glance away) is normal and unlikely to be treated as a concern on its own.',
        },
        {
          question: 'How do I appeal a flag?',
          answer: 'Contact support@proctorai.com within 7 days of your result with your exam session ID. Your instructor can review the specific flagged clip and your explanation.',
        },
        {
          question: 'I have a condition that affects my eye contact or movement — will this unfairly flag me?',
          answer: 'If you have a medical or accessibility need that could affect head/eye movement patterns (e.g., a vision or motor condition), contact support before your exam to register an accommodation. This is taken into account during human review of any flags.',
        },
      ],
    },
    {
      category: 'During the Exam',
      items: [
        {
          question: 'Can I take a break (e.g., restroom)?',
          answer: 'Only if your exam explicitly allows breaks. Use the in-session break request method rather than leaving frame unannounced, which may otherwise be flagged.',
        },
        {
          question: 'What happens if I lose internet connection mid-exam?',
          answer: 'Reconnect as quickly as possible and contact support with your session ID and the approximate time of disconnection — this will be taken into account during review.',
        },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden bg-neutral-900 py-24 md:py-32">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-green/20 blur-3xl opacity-50 mix-blend-screen"></div>
        <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl opacity-30 mix-blend-screen"></div>
        
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/50 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-green animate-pulse"></span>
              We&apos;re here to help
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-display drop-shadow-sm">
            Support & FAQ
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-400 max-w-2xl mx-auto">
            Get assistance before, during, or after your examination. Our knowledge base and support team are available to ensure a seamless experience.
          </p>
        </div>
      </div>

      {/* Main Content: Single Column */}
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-24">
        
        {/* Contact Channels Section */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Need Immediate Help?</span>
            <h2 className="mt-2 text-3xl font-extrabold text-neutral-900 font-display">
              Contact Channels
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">General Support</h3>
              <p className="mt-2 text-sm text-neutral-500">Response within 24 business hours.</p>
              <a href="mailto:support@proctorai.com" className="mt-4 text-sm font-semibold text-brand-green hover:underline">
                support@proctorai.com
              </a>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 shadow-xs text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider">Exam Emergencies</h3>
              <p className="mt-2 text-sm text-red-600/80">Available during scheduled exam windows.</p>
              <span className="mt-4 text-sm font-semibold text-red-600">
                Live Chat
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Privacy Requests</h3>
              <p className="mt-2 text-sm text-neutral-500">Data deletion and information requests.</p>
              <a href="mailto:privacy@proctorai.com" className="mt-4 text-sm font-semibold text-brand-green hover:underline">
                privacy@proctorai.com
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">KNOWLEDGE BASE</span>
            <h2 className="mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-bold text-brand-green mb-4 pb-2 border-b border-neutral-100">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item, idx) => (
                    <AccordionItem key={idx} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

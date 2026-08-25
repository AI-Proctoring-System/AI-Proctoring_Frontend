'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface ScheduledAttempt {
  id: string; // Invitation ID
  status: string;
  assessment: {
    status: string;
    id: string;
    title: string;
    assessmentType: string;
    durationMinutes: number;
    passingScore: number;
    examDate: string;
    endTime: string;
  };
}

export default function CandidatePortal() {
  const { error: toastError } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [invitations, setInvitations] = useState<ScheduledAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication role check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/candidate/login');
      } else if (user?.role === 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CANDIDATE') return;

    async function loadInvitations() {
      try {
        const data = await apiRequest<ScheduledAttempt[]>('attempts/scheduled');
        if (data) {
          const now = new Date();
          // Filter to only show active invites / in-progress assessments
          setInvitations(data.filter((item) => {
            if (item.assessment.status !== 'PUBLISHED') return false;
            if (item.assessment.endTime && new Date(item.assessment.endTime) < now) return false;
            return true;
          }));
        }
      } catch (err) {
        toastError('Failed to load candidate examinations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInvitations();
  }, [isAuthenticated, user, toastError]);

  if (isLoading || (!isAuthenticated || user?.role !== 'CANDIDATE')) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-neutral-500">Loading your candidate portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Hero section */}
      <section className="bg-neutral-50/50 border-b border-neutral-100 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-3 py-1 text-xs font-semibold text-brand-green border border-brand-green-border mb-4">
            <span>ProctorAI Secure Candidate Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">Candidate Examination Portal</h1>
          <p className="mt-4 text-base text-neutral-500 max-w-2xl mx-auto">
            You must complete identity verification and a 360-degree environment sweep before beginning your proctored assessment.
          </p>
        </div>
      </section>

      {/* Main assessment list */}
      <section className="py-12 max-w-5xl mx-auto w-full px-6">
        <h2 className="text-lg font-bold text-neutral-800 mb-6">Your Invited Examinations</h2>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : invitations.length === 0 ? (
          <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-xs">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-4 text-sm font-bold text-neutral-800">No active examinations</h3>
            <p className="mt-2 text-sm text-neutral-400">If you were invited, please contact your assessment administrator.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs hover:border-neutral-200 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-brand-green-light px-2 py-0.5 text-2xs font-semibold text-brand-green">
                      {a.assessment.assessmentType}
                    </span>
                    <span className="text-2xs text-neutral-400 font-semibold">
                      Invited
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">{a.assessment.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 font-medium pt-1">
                    <span>Duration: {a.assessment.durationMinutes} mins</span>
                    <span>•</span>
                    <span>Passing Score: {a.assessment.passingScore}%</span>
                    <span>•</span>
                    <span>Valid Date: {new Date(a.assessment.examDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link
                  href={`/candidate/exam/${a.id}`}
                  className="w-full sm:w-auto text-center rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors"
                >
                  Start Verification
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

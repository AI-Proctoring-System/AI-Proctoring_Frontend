'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface Assessment {
  id: string;
  title: string;
  assessmentType: string;
  durationMinutes: number;
  passingScore: number;
  status: string;
  examDate: string;
}

interface StatsData {
  totalAssessments: number;
  totalCandidates: number;
  averagePassRate: string;
  averageRisk: string;
  recentLogs: Array<{
    id: string;
    candidate: string;
    assessment: string;
    action: string;
    severity: string;
    time: string;
  }>;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assessList, statsData] = await Promise.all([
          apiRequest<Assessment[]>('assessments'),
          apiRequest<StatsData>('assessments/stats/overview'),
        ]);
        if (assessList) {
          setAssessments(assessList);
        }
        if (statsData) {
          setStats(statsData);
        }
      } catch (err) {
        toastError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toastError]);

  const totalAssessments = stats?.totalAssessments ?? assessments.length;
  const totalCandidates = stats?.totalCandidates ?? 0;
  const averageRisk = stats?.averageRisk ?? '0%';
  const averagePassRate = stats?.averagePassRate ?? '0%';
  const recentLogs = stats?.recentLogs ?? [];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Recruiter'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Here&apos;s an overview of your organization&apos;s active assessments and proctoring activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/assessments/new"
            className="inline-flex justify-center items-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-brand-green-hover transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Create Assessment
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Assessments */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">Total Assessments</span>
            <div className="rounded-lg bg-brand-green-light p-2 text-brand-green">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-neutral-900">{totalAssessments}</p>
        </div>

        {/* Active Candidates */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">Candidates Invited</span>
            <div className="rounded-lg bg-brand-green-light p-2 text-brand-green">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-neutral-900">{totalCandidates}</p>
        </div>

        {/* Average Pass Rate */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">Average Pass Rate</span>
            <div className="rounded-lg bg-brand-green-light p-2 text-brand-green">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-neutral-900">{averagePassRate}</p>
        </div>

        {/* Average Risk Level */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">Avg Risk Rating</span>
            <div className="rounded-lg bg-brand-green-light p-2 text-brand-green">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-neutral-900">{averageRisk}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Assessments list */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800">Your Assessments</h2>
            <Link href="/dashboard/assessments" className="text-xs font-semibold text-brand-green hover:underline">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <svg className="animate-spin h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : assessments.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <svg className="h-10 w-10 text-neutral-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-semibold text-neutral-600">No assessments created yet.</p>
              <Link
                href="/dashboard/assessments/new"
                className="mt-3 inline-flex items-center rounded-md bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-hover"
              >
                Create First Exam
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-100 text-left text-sm text-neutral-600">
                <thead>
                  <tr className="text-xs font-semibold uppercase text-neutral-400">
                    <th className="py-3">Title</th>
                    <th className="py-3">Type</th>
                    <th className="py-3">Duration</th>
                    <th className="py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 font-medium">
                  {assessments.slice(0, 5).map((a) => (
                    <tr key={a.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 pr-3 text-neutral-900 font-semibold">{a.title}</td>
                      <td className="py-3.5">{a.assessmentType}</td>
                      <td className="py-3.5">{a.durationMinutes} mins</td>
                      <td className="py-3.5 text-center">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          a.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent telemetry alerts */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800">Proctoring Feed</h2>
            <Link href="/dashboard/logs" className="text-xs font-semibold text-brand-green hover:underline">
              View Logs
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex gap-3 rounded-lg border border-neutral-50 bg-neutral-50/20 p-3 hover:bg-neutral-50/50 transition-colors">
                <div className="mt-0.5">
                  {log.severity === 'CRITICAL' ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold animate-pulse">!</span>
                  ) : log.severity === 'HIGH' ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-bold">!</span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">i</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-neutral-800 truncate">{log.candidate}</p>
                    <span className="text-2xs text-neutral-400 font-semibold">
                      {log.time ? new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">{log.action}</p>
                  <p className="text-2xs text-neutral-400 mt-1 truncate">{log.assessment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

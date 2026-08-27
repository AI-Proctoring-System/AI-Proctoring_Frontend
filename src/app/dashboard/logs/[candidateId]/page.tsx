'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '../../../../utils/api';
import { useToast } from '../../../../context/ToastContext';

interface LogEvent {
  id: string;
  eventType: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'LOW';
  timestamp: string;
}

interface CandidateLogsSummary {
  id: string; // Attempt ID
  name: string;
  email: string;
  assessmentTitle: string;
  overallRisk: 'CRITICAL' | 'HIGH' | 'LOW';
  tabSwitches: number;
  faceMatchStatus: 'CONFIRMED' | 'FAILED' | 'WARNING';
  roomScanStatus: 'CLEAN' | 'WARNING';
  events: LogEvent[];
}

export default function CandidateLogsPage() {
  const router = useRouter();
  const params = useParams();
  const { candidateId } = params; // This represents the attempt ID
  const { error: toastError } = useToast();

  const [candidateData, setCandidateData] = useState<CandidateLogsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Search and Pagination State for events
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!candidateId) return;

    async function loadCandidateLog() {
      try {
        const data = await apiRequest<CandidateLogsSummary[]>('assessments/logs/all');
        if (data) {
          const matched = data.find(c => c.id === candidateId);
          if (matched) {
            setCandidateData(matched);
          } else {
            toastError('Specific candidate proctoring report not found.');
            router.push('/dashboard/logs');
          }
        }
      } catch (err) {
        toastError('Failed to load candidate proctoring logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCandidateLog();
  }, [candidateId, toastError, router]);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!candidateData) return null;

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div>
        <Link
          href="/dashboard/logs"
          className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Proctoring Reports
        </Link>
      </div>

      {/* Main Candidate Card Summary */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-neutral-50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-light text-brand-green font-bold text-base">
              {candidateData.name ? candidateData.name.split(' ').map((n) => n[0]).join('') : '?'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">{candidateData.name}</h1>
              <p className="text-xs text-neutral-500 font-medium">{candidateData.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xs text-neutral-400 font-bold uppercase">Risk Level:</span>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-2xs font-extrabold border ${candidateData.overallRisk === 'CRITICAL'
                ? 'bg-red-50 text-red-700 border-red-100 animate-pulse'
                : candidateData.overallRisk === 'HIGH'
                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
              {candidateData.overallRisk}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50/50 rounded-xl p-4 border border-neutral-100/50">
            <span className="block text-3xs font-bold text-neutral-400 uppercase">Assessment Title</span>
            <span className="text-sm font-bold text-neutral-800 leading-snug block mt-1">{candidateData.assessmentTitle}</span>
          </div>
          <div className="bg-neutral-50/50 rounded-xl p-4 border border-neutral-100/50">
            <span className="block text-3xs font-bold text-neutral-400 uppercase">Exam Attempt ID</span>
            <span className="text-sm font-mono text-neutral-600 block mt-1 break-all">{candidateData.id}</span>
          </div>
          <div className="bg-neutral-50/50 rounded-xl p-4 border border-neutral-100/50 flex flex-col justify-center">
            <span className="block text-3xs font-bold text-neutral-400 uppercase mb-1">Status Overview</span>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-neutral-700">Active Attempt logs</span>
            </div>
          </div>
        </div>

        {/* Compliance metrics widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Tab switches */}
          <div className="border border-neutral-100 bg-white rounded-xl p-4 text-center">
            <span className="block text-3xs font-bold text-neutral-400 uppercase">Tab Switches</span>
            <span className={`text-xl font-black block mt-1 ${candidateData.tabSwitches > 0 ? 'text-red-600' : 'text-neutral-700'}`}>
              {candidateData.tabSwitches}
            </span>
            <span className="text-4xs text-neutral-400 uppercase font-semibold mt-1 block">Limit exceeded if &gt; 5</span>
          </div>

          {/* Identity verification */}
          <div className="border border-neutral-100 bg-white rounded-xl p-4 text-center">
            <span className="block text-3xs font-bold text-neutral-400 uppercase">Identity Verification</span>
            <span className={`text-xl font-black block mt-1 ${candidateData.faceMatchStatus === 'CONFIRMED' ? 'text-brand-green' : 'text-amber-600'}`}>
              {candidateData.faceMatchStatus}
            </span>
            <span className="text-4xs text-neutral-400 uppercase font-semibold mt-1 block">Initial camera selfie check</span>
          </div>

          {/* Room scan status */}
          <div className="border border-neutral-100 bg-white rounded-xl p-4 text-center">
            <span className="block text-3xs font-bold text-neutral-400 uppercase">Room Cleanliness</span>
            <span className={`text-xl font-black block mt-1 ${candidateData.roomScanStatus === 'CLEAN' ? 'text-brand-green' : 'text-amber-600'}`}>
              {candidateData.roomScanStatus}
            </span>
            <span className="text-4xs text-neutral-400 uppercase font-semibold mt-1 block">Workspace environmental scan</span>
          </div>
        </div>
      </div>

      {/* Proctoring Event Timeline */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-50 pb-2 gap-4">
          <h2 className="text-base font-bold text-neutral-800">Violation History Timeline</h2>
          {candidateData.events.length > 0 && (
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          )}
        </div>

        {candidateData.events.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-sm font-bold text-neutral-800">Perfect compliance session</h3>
            <p className="mt-2 text-xs text-neutral-400 max-w-sm mx-auto">No proctoring violations, tab switches, or object anomalies were flagged during this candidate&apos;s test window.</p>
          </div>
        ) : (
          <div className="space-y-4">
              <div className="relative border-l border-neutral-200 pl-6 ml-4 space-y-8 pt-2 pb-2">
                {(() => {
                  const filteredEvents = candidateData.events.filter((e) => {
                    const q = searchQuery.toLowerCase();
                    return e.eventType.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
                  });

                  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
                  const paginatedEvents = filteredEvents.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  );

                  if (filteredEvents.length === 0) {
                    return <p className="text-xs text-neutral-500 py-4">No events match your search.</p>;
                  }

                  return (
                    <>
                      {paginatedEvents.map((e) => (
                        <div key={e.id} className="relative">
                          {/* Timeline node marker */}
                          <span className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-4 border-white shadow-xs ${e.severity === 'CRITICAL'
                            ? 'bg-red-500'
                            : e.severity === 'HIGH'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'}`}></span>

                          <div className="bg-neutral-50/40 rounded-xl p-4 border border-neutral-100 hover:border-neutral-200 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`inline-block rounded-md px-1.5 py-0.5 text-4xs font-extrabold text-white ${e.severity === 'CRITICAL'
                                  ? 'bg-red-600'
                                  : e.severity === 'HIGH'
                                    ? 'bg-amber-500'
                                    : 'bg-blue-500'}`}>
                                  {e.severity}
                                </span>
                                <h4 className="text-xs font-bold text-neutral-900">{e.eventType}</h4>
                              </div>

                              <span className="text-3xs font-semibold text-neutral-400">
                                {e.timestamp ? new Date(e.timestamp).toLocaleString() : ''}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-medium">{e.description}</p>
                          </div>
                        </div>
                      ))}

                      {/* Pagination Controls for Events */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 mt-6">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-3xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <span className="text-3xs font-medium text-neutral-500">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-3xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';

interface LogEvent {
  id: string;
  eventType: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'LOW';
  timestamp: string;
}

interface CandidateLogsSummary {
  id: string; // attempt ID
  name: string;
  email: string;
  assessmentTitle: string;
  overallRisk: 'CRITICAL' | 'HIGH' | 'LOW';
  tabSwitches: number;
  faceMatchStatus: 'CONFIRMED' | 'FAILED' | 'WARNING';
  roomScanStatus: 'CLEAN' | 'WARNING';
  events: LogEvent[];
}

export default function ProctoringLogsPage() {
  const { error: toastError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'LOW'>('ALL');
  const [candidatesData, setCandidatesData] = useState<CandidateLogsSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch telemetry logs from backend
  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await apiRequest<CandidateLogsSummary[]>('assessments/logs/all');
        if (data) {
          setCandidatesData(data);
        }
      } catch (err) {
        toastError('Failed to load proctoring logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [toastError]);

  const filteredCandidates = candidatesData.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assessmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || c.overallRisk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, riskFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Proctoring Telemetry Logs</h1>
        <p className="mt-1 text-sm text-neutral-500 font-medium">
          Monitor real-time compliance metrics, flags, and candidate proctoring event timelines.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search candidate, email, or assessment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-3 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 p-1 rounded-xl">
          {(['ALL', 'CRITICAL', 'HIGH', 'LOW'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setRiskFilter(filter)}
              className={`rounded-lg px-3 py-1 text-3xs font-bold transition-all cursor-pointer ${
                riskFilter === filter
                  ? 'bg-white text-neutral-800 shadow-xs border border-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-xs">
          <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-sm font-bold text-neutral-800 font-display">No proctoring logs found</h3>
          <p className="mt-2 text-sm text-neutral-400">No telemetry data matches your current search/filter settings.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCandidates.map((c) => {
            const initials = c.name ? c.name.split(' ').map((n) => n[0]).join('') : '?';
            return (
              <div key={c.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-neutral-200 transition-colors">
                <div>
                  {/* Card Header: Initials, Name, Risk Level */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green font-bold text-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-neutral-900 truncate">{c.name}</h3>
                        <p className="text-3xs text-neutral-400 truncate">{c.email}</p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-3xs font-extrabold border ${
                      c.overallRisk === 'CRITICAL'
                        ? 'bg-red-50 text-red-700 border-red-100 animate-pulse'
                        : c.overallRisk === 'HIGH'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {c.overallRisk} RISK
                    </span>
                  </div>

                  {/* Assessment Info */}
                  <div className="mt-4 bg-neutral-50/50 rounded-xl p-3 border border-neutral-100">
                    <span className="block text-3xs font-bold text-neutral-400 uppercase">Assessment</span>
                    <span className="text-xs font-bold text-neutral-800 leading-tight block mt-0.5 truncate">{c.assessmentTitle}</span>
                  </div>

                  {/* Metrics Row */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center py-2 bg-neutral-50/20 rounded-xl border border-neutral-100/50">
                    <div>
                      <span className="block text-3xs text-neutral-400 font-semibold uppercase">Tab Switches</span>
                      <span className={`text-xs font-extrabold ${c.tabSwitches > 0 ? 'text-red-600' : 'text-neutral-700'}`}>
                        {c.tabSwitches}
                      </span>
                    </div>
                    <div>
                      <span className="block text-3xs text-neutral-400 font-semibold uppercase">Face Match</span>
                      <span className={`text-xs font-extrabold ${c.faceMatchStatus === 'FAILED' ? 'text-red-600' : 'text-brand-green'}`}>
                        {c.faceMatchStatus}
                      </span>
                    </div>
                    <div>
                      <span className="block text-3xs text-neutral-400 font-semibold uppercase">Room Scan</span>
                      <span className={`text-xs font-extrabold ${c.roomScanStatus === 'WARNING' ? 'text-amber-600' : 'text-brand-green'}`}>
                        {c.roomScanStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Redirect Button */}
                <div className="mt-6 pt-4 border-t border-neutral-50">
                  <Link
                    href={`/dashboard/logs/${c.id}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-brand-green hover:border-brand-green transition-all"
                  >
                    View Proctoring Logs
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-neutral-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

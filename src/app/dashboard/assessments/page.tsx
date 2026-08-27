'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';

interface Assessment {
  id: string;
  title: string;
  assessmentType: string;
  durationMinutes: number;
  passingScore: number;
  status: string;
  examDate: string;
}

export default function AssessmentsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await apiRequest<Assessment[]>('assessments');
        if (data) {
          setAssessments(data);
        }
      } catch (err) {
        toastError('Failed to load assessments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [toastError]);



  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await apiRequest(`assessments/${id}`, { method: 'DELETE' });
      toastSuccess('Assessment deleted successfully.');
      setAssessments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to delete assessment.');
    }
  };

  // Derived state for filtering and pagination
  const filteredAssessments = assessments.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(query) ||
      a.assessmentType.toLowerCase().includes(query) ||
      a.status.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const paginatedAssessments = filteredAssessments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Assessments</h1>
          <p className="mt-1 text-sm text-neutral-500 font-medium">Create and customize monitoring parameters for exam candidates.</p>
        </div>
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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search assessments by title, type, or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-3 py-2 text-xs text-neutral-900 focus:border-brand-green focus:outline-none transition-colors shadow-xs"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : assessments.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-xs">
          <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-sm font-bold text-neutral-800">No assessments found</h3>
          <p className="mt-2 text-sm text-neutral-400">Get started by creating your first draft assessment now.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/assessments/new"
              className="inline-flex items-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-brand-green-hover"
            >
              Create Assessment
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedAssessments.map((a) => (
            <div key={a.id} className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    a.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {a.status}
                  </span>
                  <span className="text-xs text-neutral-400 font-semibold">{a.assessmentType}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-neutral-900 leading-tight">{a.title}</h3>
                
                <div className="mt-4 space-y-2 text-sm text-neutral-500 font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{a.durationMinutes} minutes duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Passing Score: {a.passingScore}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Date: {new Date(a.examDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end border-t border-neutral-50 pt-4 gap-2">
                <Link
                  href={`/dashboard/assessments/edit/${a.id}`}
                  className="rounded-md p-1.5 text-neutral-400 hover:text-brand-green hover:bg-brand-green-light/20 transition-colors"
                  title="Edit Assessment"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="rounded-md p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Assessment"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
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

'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'PENDING' | 'INVITED' | 'COMPLETED';
  invitedAssessmentIds?: string[];
}

interface Assessment {
  id: string;
  title: string;
  status: string;
  endTime: string;
}

export default function CandidatesPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  
  // State
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [assessmentToConfirm, setAssessmentToConfirm] = useState<Assessment | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Edit Candidate State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidateId(candidate.id);
    setEditFirstName(candidate.firstName);
    setEditLastName(candidate.lastName);
    setEditPhone(candidate.phone || '');
    setShowEditModal(true);
  };

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidateId) return;

    // Check if it's a local pending candidate
    const localPending = JSON.parse(localStorage.getItem('pendingCandidates') || '[]');
    const localCandidateIndex = localPending.findIndex((c: Candidate) => c.id === editingCandidateId);

    if (localCandidateIndex !== -1) {
      localPending[localCandidateIndex] = {
        ...localPending[localCandidateIndex],
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone || undefined,
      };
      localStorage.setItem('pendingCandidates', JSON.stringify(localPending));
      setCandidates(prev => prev.map(c => c.id === editingCandidateId ? {
        ...c,
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone || undefined,
      } : c));
      toastSuccess('Candidate updated successfully.');
      setShowEditModal(false);
      return;
    }

    try {
      await apiRequest(`assessments/candidates/${editingCandidateId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          phone: editPhone || undefined,
        }),
      });
      toastSuccess('Candidate updated successfully.');
      setCandidates(prev => prev.map(c => c.id === editingCandidateId ? {
        ...c,
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone || undefined,
      } : c));
      setShowEditModal(false);
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to update candidate.');
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate? This will remove all their invitations and exam attempts.')) return;
    
    // Check if it's a local pending candidate
    const localPending = JSON.parse(localStorage.getItem('pendingCandidates') || '[]');
    const isLocal = localPending.some((c: Candidate) => c.id === id);

    if (isLocal) {
      const updatedLocalPending = localPending.filter((c: Candidate) => c.id !== id);
      localStorage.setItem('pendingCandidates', JSON.stringify(updatedLocalPending));
      setCandidates(prev => prev.filter(c => c.id !== id));
      toastSuccess('Candidate deleted successfully.');
      return;
    }

    try {
      await apiRequest(`assessments/candidates/${id}`, { method: 'DELETE' });
      toastSuccess('Candidate deleted successfully.');
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to delete candidate.');
    }
  };

  // Fetch unique candidates
  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await apiRequest<Candidate[]>('assessments/candidates/all');
        if (data) {
          // Load local pending candidates
          const localPending = JSON.parse(localStorage.getItem('pendingCandidates') || '[]');
          setCandidates([...data, ...localPending]);
        }
      } catch (err) {
        toastError('Failed to load candidate list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, [toastError]);



  // Fetch active assessments for invitation
  useEffect(() => {
    async function loadAssessments() {
      try {
        const data = await apiRequest<Assessment[]>('assessments');
        if (data) {
          setAssessments(data.filter((a) => a.status === 'PUBLISHED'));
        }
      } catch (err) {
        console.error('Failed to load assessments for invitation list:', err);
      }
    }
    loadAssessments();
  }, []);

  // Parse CSV File manually
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const newCandidates: Candidate[] = [];

      lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return; // Skip headers / empty lines
        
        // Split by comma (handles basic CSV parsing)
        const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length >= 3) {
          newCandidates.push({
            id: `imported_${Date.now()}_${index}`,
            firstName: cols[0],
            lastName: cols[1],
            email: cols[2],
            phone: cols[3] || undefined,
            status: 'PENDING',
          });
        }
      });

      if (newCandidates.length > 0) {
        setCandidates(prev => [...prev, ...newCandidates]);
        
        // Save to local storage
        const localPending = JSON.parse(localStorage.getItem('pendingCandidates') || '[]');
        localStorage.setItem('pendingCandidates', JSON.stringify([...localPending, ...newCandidates]));

        toastSuccess(`Successfully imported ${newCandidates.length} candidates from CSV.`);
      } else {
        toastError('Failed to parse CSV. Make sure fields are ordered: First Name, Last Name, Email, Phone.');
      }
    };
    reader.readAsText(file);
  };

  // Export CSV
  const handleCsvExport = () => {
    const headers = 'First Name,Last Name,Email,Phone,Status\n';
    const rows = candidates
      .map(c => `"${c.firstName}","${c.lastName}","${c.email}","${c.phone || ''}","${c.status}"`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'proctor_candidates_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastSuccess('Candidates list exported successfully.');
  };

  // Trigger Invite Request
  const handleInviteToAssessment = async (assessmentId: string) => {
    if (!selectedCandidate) return;

    setSendingInvite(true);
    try {
      await apiRequest(`assessments/${assessmentId}/invitations/bulk`, {
        method: 'POST',
        body: JSON.stringify({
          candidates: [
            {
              firstName: selectedCandidate.firstName,
              lastName: selectedCandidate.lastName,
              email: selectedCandidate.email,
              phone: selectedCandidate.phone || undefined,
            }
          ]
        })
      });

      toastSuccess(`Invitation sent to ${selectedCandidate.firstName} for the test.`);
      
      // Update local status of this candidate
      setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, status: 'INVITED' } : c));
      
      // Remove from local storage since it's now in the backend
      const localPending = JSON.parse(localStorage.getItem('pendingCandidates') || '[]');
      const updatedLocalPending = localPending.filter((c: Candidate) => c.id !== selectedCandidate.id);
      localStorage.setItem('pendingCandidates', JSON.stringify(updatedLocalPending));

      setShowInviteModal(false);
      setAssessmentToConfirm(null);
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to dispatch invitation request.');
    } finally {
      setSendingInvite(false);
    }
  };

  // Derived state for filtering and pagination
  const filteredCandidates = candidates.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(query) ||
      c.lastName.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.toLowerCase().includes(query)) ||
      c.status.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate eligible assessments for the modal
  const now = new Date();
  const eligibleAssessments = selectedCandidate
    ? assessments.filter((a) => {
        const isExpired = new Date(a.endTime) < now;
        const isAlreadyInvited = selectedCandidate.invitedAssessmentIds?.includes(a.id);
        return !isExpired && !isAlreadyInvited;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Candidates</h1>
          <p className="mt-1 text-sm text-neutral-500 font-medium">Manage corporate candidate credentials and assign secure assessments.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export */}
          <button
            onClick={handleCsvExport}
            className="inline-flex justify-center items-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <svg className="mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export List
          </button>

          {/* Import file label wrapper */}
          <label className="inline-flex justify-center items-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-brand-green-hover transition-colors cursor-pointer">
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              className="hidden"
            />
          </label>
        </div>
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
          placeholder="Search candidates by name, email, or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-3 py-2 text-xs text-neutral-900 focus:border-brand-green focus:outline-none transition-colors shadow-xs"
        />
      </div>

      {/* Grid Layout of Candidates cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : candidates.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-xs">
          <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-4 text-sm font-bold text-neutral-800 font-display">No candidates invited yet</h3>
          <p className="mt-2 text-sm text-neutral-400">Import a CSV of candidate emails or details to begin inviting them to secure exams.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCandidates.map((candidate) => (
            <div key={candidate.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-neutral-200 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green font-bold text-sm">
                    {candidate.firstName ? candidate.firstName[0] : ''}{candidate.lastName ? candidate.lastName[0] : ''}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 truncate">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">{candidate.email}</p>
                  </div>
                  {/* Action buttons (Edit & Delete) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(candidate)}
                      className="rounded-md p-1 text-neutral-400 hover:text-brand-green hover:bg-brand-green-light/20 transition-colors cursor-pointer"
                      title="Edit Candidate"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      className="rounded-md p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Candidate"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-neutral-500 font-medium">
                  {candidate.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Phone:</span>
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Status:</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-3xs font-bold ${
                      candidate.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : candidate.status === 'INVITED'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-neutral-50 text-neutral-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invite button */}
              <div className="mt-6 pt-4 border-t border-neutral-50">
                <button
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setShowInviteModal(true);
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Invite to Test
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

      {/* Inline Modal for inviting candidate to test */}
      {showInviteModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
              <h2 className="text-base font-bold text-neutral-800">
                {assessmentToConfirm 
                  ? 'Confirm Invitation' 
                  : `Invite ${selectedCandidate.firstName} to Test`}
              </h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setAssessmentToConfirm(null);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {assessmentToConfirm ? (
              <div className="space-y-4 py-2">
                <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100">
                  <p className="text-sm text-neutral-700">
                    You are about to invite <span className="font-bold text-neutral-900">{selectedCandidate.firstName} {selectedCandidate.lastName}</span> to take the following assessment:
                  </p>
                  <div className="mt-3 bg-white border border-neutral-200 rounded-md p-3">
                    <h4 className="text-xs font-bold text-neutral-800">{assessmentToConfirm.title}</h4>
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">
                    An email will be sent immediately to <span className="font-medium text-neutral-700">{selectedCandidate.email}</span>.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleInviteToAssessment(assessmentToConfirm.id)}
                    disabled={sendingInvite}
                    className="flex-1 flex items-center justify-center rounded-lg bg-brand-green py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sendingInvite ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Confirm & Send Email'}
                  </button>
                  <button
                    onClick={() => setAssessmentToConfirm(null)}
                    disabled={sendingInvite}
                    className="flex-1 rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : eligibleAssessments.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-4">
                No eligible published assessments available for this candidate.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {eligibleAssessments.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAssessmentToConfirm(a)}
                    disabled={sendingInvite}
                    className="w-full text-left rounded-lg border border-neutral-100 p-3 hover:border-brand-green hover:bg-brand-green-light/20 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800">{a.title}</h4>
                      <p className="text-3xs text-neutral-400 uppercase mt-0.5">Status: {a.status}</p>
                    </div>
                    <svg className="h-4 w-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Edit Candidate Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
              <h2 className="text-base font-bold text-neutral-800">
                Edit Candidate Profile
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateCandidate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Phone (Optional)</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2 border-t border-neutral-50">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-brand-green py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

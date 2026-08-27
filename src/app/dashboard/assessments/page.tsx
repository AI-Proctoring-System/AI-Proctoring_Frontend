'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import ConfirmModal from '../../../components/ConfirmModal';

interface Assessment {
  id: string;
  title: string;
  assessmentType: string;
  durationMinutes: number;
  passingScore: number;
  status: string;
  examDate: string;
}

interface ValidationError {
  itemTitle: string;
  errors: string[];
}

interface ImportQuestionOption {
  optionText: string;
  optionLabel: string;
  isCorrect: boolean;
  orderNumber?: number;
}

interface ImportQuestion {
  questionType?: string;
  questionText?: string;
  marks?: number;
  orderNumber?: number;
  options?: ImportQuestionOption[];
}

interface ImportAssessmentItem {
  title: string;
  description?: string;
  assessmentType?: string;
  durationMinutes?: number;
  passingScore?: number;
  instructions?: string;
  allowedMaterials?: string[];
  prohibitedMaterials?: string[];
  questions?: ImportQuestion[];
}

export default function AssessmentsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchAssessments = useCallback(async () => {
    try {
      const data = await apiRequest<Assessment[]>('assessments');
      if (data) {
        setAssessments(data);
      }
    } catch {
      toastError('Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    const loadData = async () => {
      await fetchAssessments();
    };
    loadData();
  }, [fetchAssessments]);

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);
    try {
      await apiRequest(`assessments/${deleteModalId}`, { method: 'DELETE' });
      toastSuccess('Assessment deleted successfully.');
      setAssessments((prev) => prev.filter((a) => a.id !== deleteModalId));
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to delete assessment.');
    } finally {
      setIsDeleting(false);
      setDeleteModalId(null);
    }
  };

  // CSV Parser helper
  const parseCSVLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const parseCSV = (text: string): ImportAssessmentItem[] => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const itemsMap: Record<string, ImportAssessmentItem> = {};

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length === 0) continue;

      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = row[idx] || '';
      });

      const title = rowObj.title || rowObj.name || rowObj.assessmenttitle;
      if (!title) continue;

      if (!itemsMap[title]) {
        itemsMap[title] = {
          title,
          description: rowObj.description || '',
          assessmentType: rowObj.assessmenttype || 'Technical Interview',
          durationMinutes: parseInt(rowObj.durationminutes || rowObj.duration || '60', 10),
          passingScore: parseInt(rowObj.passingscore || '70', 10),
          instructions: rowObj.instructions || '',
          allowedMaterials: rowObj.allowedmaterials ? rowObj.allowedmaterials.split(';') : ['Blank Paper'],
          prohibitedMaterials: rowObj.prohibitedmaterials ? rowObj.prohibitedmaterials.split(';') : ['Mobile Phone'],
          questions: [],
        };
      }

      const qText = rowObj.questiontext || rowObj.question;
      if (qText) {
        const qType = (rowObj.questiontype || 'MCQ').toUpperCase();
        const marks = parseInt(rowObj.marks || '1', 10);
        const optA = rowObj.optiona;
        const optB = rowObj.optionb;
        const optC = rowObj.optionc;
        const optD = rowObj.optiond;
        const correct = (rowObj.correctoption || 'A').toUpperCase();

        const options: ImportQuestionOption[] = [];
        if (optA) options.push({ optionText: optA, optionLabel: 'A', isCorrect: correct === 'A' || correct === '1' });
        if (optB) options.push({ optionText: optB, optionLabel: 'B', isCorrect: correct === 'B' || correct === '2' });
        if (optC) options.push({ optionText: optC, optionLabel: 'C', isCorrect: correct === 'C' || correct === '3' });
        if (optD) options.push({ optionText: optD, optionLabel: 'D', isCorrect: correct === 'D' || correct === '4' });

        itemsMap[title].questions?.push({
          questionType: qType,
          questionText: qText,
          marks: isNaN(marks) ? 1 : marks,
          options: options.length > 0 ? options : undefined,
        });
      }
    }

    return Object.values(itemsMap);
  };

  // Validate items against requirements and existing database entries BEFORE uploading!
  const validateImportData = (items: ImportAssessmentItem[]): ValidationError[] => {
    const errorList: ValidationError[] = [];

    items.forEach((item, index) => {
      const itemErrors: string[] = [];
      const itemTitle = item.title ? item.title.trim() : `Item #${index + 1}`;

      // Requirement 1: Title presence & length
      if (!item.title || typeof item.title !== 'string' || item.title.trim().length < 3) {
        itemErrors.push('Assessment title must be at least 3 characters long.');
      } else {
        // Requirement 2: Check for existing title in local database
        const isDuplicate = assessments.some(
          (existing) => existing.title.trim().toLowerCase() === item.title.trim().toLowerCase()
        );
        if (isDuplicate) {
          itemErrors.push(`An assessment with title "${item.title}" already exists in your dashboard.`);
        }
      }

      // Requirement 3: Duration Minutes
      const duration = Number(item.durationMinutes);
      if (isNaN(duration) || duration <= 0) {
        itemErrors.push('Duration minutes must be a valid positive number (e.g. 30, 60).');
      }

      // Requirement 4: Passing Score
      const passingScore = Number(item.passingScore);
      if (isNaN(passingScore) || passingScore < 1 || passingScore > 100) {
        itemErrors.push('Passing score must be a number between 1 and 100.');
      }

      // Requirement 5: Questions (if provided)
      if (Array.isArray(item.questions)) {
        item.questions.forEach((q: ImportQuestion, qIdx: number) => {
          if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim() === '') {
            itemErrors.push(`Question #${qIdx + 1}: Missing question text.`);
          }
          if (q.questionType === 'MCQ') {
            if (!Array.isArray(q.options) || q.options.length < 2) {
              itemErrors.push(`Question #${qIdx + 1}: MCQ requires at least 2 options.`);
            } else {
              const hasCorrect = q.options.some((opt: ImportQuestionOption) => opt.isCorrect);
              if (!hasCorrect) {
                itemErrors.push(`Question #${qIdx + 1}: MCQ must specify at least one correct option.`);
              }
            }
          }
        });
      }

      if (itemErrors.length > 0) {
        errorList.push({ itemTitle, errors: itemErrors });
      }
    });

    return errorList;
  };

  // Helper to deploy single assessment payload to backend
  const deployAssessment = async (payload: ImportAssessmentItem) => {
    // 1. Create Assessment core
    const newAssessment = await apiRequest<{ id: string }>('assessments', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title.trim(),
        description: payload.description || '',
        assessmentType: payload.assessmentType || 'Technical Interview',
        durationMinutes: Number(payload.durationMinutes) || 60,
        passingScore: Number(payload.passingScore) || 70,
        instructions: payload.instructions || 'Please follow exam guidelines.',
        allowedMaterials: payload.allowedMaterials || ['Blank Paper'],
        prohibitedMaterials: payload.prohibitedMaterials || ['Mobile Phone'],
      }),
    });

    if (!newAssessment?.id) {
      throw new Error('Failed to create assessment core structure.');
    }

    const assessmentId = newAssessment.id;

    // 2. Schedule times (default to today 9 AM - 11:59 PM)
    const datePart = new Date().toISOString().split('T')[0];
    const startDateTime = new Date(`${datePart}T09:00:00`).toISOString();
    const endDateTime = new Date(`${datePart}T23:59:00`).toISOString();

    await apiRequest(`assessments/${assessmentId}/schedule`, {
      method: 'PATCH',
      body: JSON.stringify({
        examDate: startDateTime,
        startTime: startDateTime,
        endTime: endDateTime,
      }),
    });

    // 3. Proctoring rules
    await apiRequest(`assessments/${assessmentId}/rules`, {
      method: 'PATCH',
      body: JSON.stringify({
        identityVerificationEnabled: true,
        personDetectionEnabled: true,
        objectDetectionEnabled: true,
        headGazeMonitoringEnabled: true,
        voiceMonitoringEnabled: false,
        fullscreenMonitoringEnabled: true,
        maxTabSwitches: 5,
      }),
    });

    // 4. Questions
    if (Array.isArray(payload.questions) && payload.questions.length > 0) {
      const cleanedQuestions = payload.questions.map((q: ImportQuestion, idx: number) => ({
        questionType: q.questionType || 'MCQ',
        questionText: q.questionText || 'Question text',
        marks: Number(q.marks) || 1,
        orderNumber: q.orderNumber || idx + 1,
        options: Array.isArray(q.options)
          ? q.options.map((opt: ImportQuestionOption, optIdx: number) => ({
              optionText: opt.optionText || '',
              optionLabel: opt.optionLabel || String.fromCharCode(65 + optIdx),
              isCorrect: !!opt.isCorrect,
              orderNumber: opt.orderNumber || optIdx + 1,
            }))
          : undefined,
      }));

      await apiRequest(`assessments/${assessmentId}/questions/bulk`, {
        method: 'POST',
        body: JSON.stringify({ questions: cleanedQuestions }),
      });
    }
  };

  // File Upload Handler (Supports both .json and .csv files!)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith('.csv');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        let items: ImportAssessmentItem[] = [];

        if (isCSV) {
          items = parseCSV(text);
        } else {
          const parsed = JSON.parse(text);
          items = Array.isArray(parsed) ? parsed : [parsed];
        }

        if (!items || items.length === 0) {
          toastError('The uploaded file is empty or formatted incorrectly.');
          return;
        }

        // STRICT PRE-UPLOAD VALIDATION
        const errors = validateImportData(items);
        if (errors.length > 0) {
          // DO NOT UPLOAD! Display validation error modal on screen cleanly.
          setValidationErrors(errors);
          setShowErrorModal(true);
          toastError('Import failed due to validation errors. Please check the on-screen details.');
          return;
        }

        // All items passed validation! Proceed with upload safely.
        setImporting(true);
        let successCount = 0;

        for (const item of items) {
          try {
            await deployAssessment(item);
            successCount++;
          } catch (err) {
            const errorVal = err as Error;
            setValidationErrors([
              {
                itemTitle: item.title,
                errors: [errorVal.message || 'API request failed during creation.'],
              },
            ]);
            setShowErrorModal(true);
            break;
          }
        }

        if (successCount > 0) {
          toastSuccess(`Successfully imported ${successCount} assessment(s)!`);
          await fetchAssessments();
        }
      } catch {
        toastError('Failed to parse file. Please ensure it is a valid JSON or CSV format.');
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  // Export full single assessment to JSON
  const handleExportAssessment = async (id: string, title: string) => {
    try {
      const details = await apiRequest<ImportAssessmentItem>(`assessments/${id}`);
      const questions = await apiRequest<ImportQuestion[]>(`assessments/${id}/questions`);

      const exportData = {
        title: details?.title || title,
        description: details?.description,
        assessmentType: details?.assessmentType,
        durationMinutes: details?.durationMinutes,
        passingScore: details?.passingScore,
        instructions: details?.instructions,
        allowedMaterials: details?.allowedMaterials,
        prohibitedMaterials: details?.prohibitedMaterials,
        questions: questions || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_assessment.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toastSuccess(`Exported "${title}" JSON package.`);
    } catch {
      toastError('Failed to export assessment.');
    }
  };

  // Export ALL assessments in one JSON array
  const handleExportAllAssessments = async () => {
    if (assessments.length === 0) {
      toastError('No assessments available to export.');
      return;
    }

    setImporting(true);
    try {
      const allData = [];
      for (const a of assessments) {
        const details = await apiRequest<ImportAssessmentItem>(`assessments/${a.id}`);
        const questions = await apiRequest<ImportQuestion[]>(`assessments/${a.id}/questions`);

        allData.push({
          title: details?.title || a.title,
          description: details?.description,
          assessmentType: details?.assessmentType || a.assessmentType,
          durationMinutes: details?.durationMinutes || a.durationMinutes,
          passingScore: details?.passingScore || a.passingScore,
          instructions: details?.instructions,
          allowedMaterials: details?.allowedMaterials,
          prohibitedMaterials: details?.prohibitedMaterials,
          questions: questions || [],
        });
      }

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all_assessments_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toastSuccess(`Successfully exported ${allData.length} assessments as a JSON array!`);
    } catch {
      toastError('Failed to export all assessments.');
    } finally {
      setImporting(false);
    }
  };

  // Sample CSV Download generator
  const handleDownloadSampleCSV = () => {
    const csvContent =
      'Title,Description,AssessmentType,DurationMinutes,PassingScore,Instructions,AllowedMaterials,ProhibitedMaterials,QuestionType,QuestionText,Marks,OptionA,OptionB,OptionC,OptionD,CorrectOption\n' +
      '"Frontend React Test","Evaluates React hooks & state","Technical Interview",45,70,"Webcam required","Blank Paper","Mobile Phone","MCQ","Which hook handles side effects?",1,"useState","useEffect","useContext","useRef","B"\n' +
      '"Frontend React Test","Evaluates React hooks & state","Technical Interview",45,70,"Webcam required","Blank Paper","Mobile Phone","CODING","Write a custom hook for window resizing",2,"","","","",""';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_assessment_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastSuccess('Sample CSV template downloaded.');
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Assessments</h1>
          <p className="mt-1 text-sm text-neutral-500 font-medium">
            Create or import assessments (JSON or CSV) for exam candidates.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Sample CSV Link */}
          <button
            onClick={handleDownloadSampleCSV}
            className="inline-flex justify-center items-center rounded-lg border border-brand-green bg-white px-3.5 py-2 text-xs font-bold text-brand-green hover:bg-brand-green-light/20 transition-colors shadow-xs cursor-pointer"
            title="Download CSV format template"
          >
            <svg className="mr-1.5 h-4 w-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Sample CSV
          </button>

          {/* Import JSON/CSV File */}
          <label className="inline-flex justify-center items-center rounded-lg border border-brand-green bg-white px-3.5 py-2 text-xs font-bold text-brand-green hover:bg-brand-green-light/20 transition-colors shadow-xs cursor-pointer">
            <svg className="mr-1.5 h-4 w-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {importing ? 'Uploading...' : 'Import (JSON / CSV)'}
            <input type="file" accept=".json,.csv" onChange={handleFileUpload} disabled={importing} className="hidden" />
          </label>

          {/* Export All JSON */}
          <button
            onClick={handleExportAllAssessments}
            disabled={importing || assessments.length === 0}
            className="inline-flex justify-center items-center rounded-lg border border-brand-green bg-white px-3.5 py-2 text-xs font-bold text-brand-green hover:bg-brand-green-light/20 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            title="Export all assessments into a single JSON file"
          >
            <svg className="mr-1.5 h-4 w-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export All
          </button>

          {/* Manual Create Assessment */}
          <Link
            href="/dashboard/assessments/new"
            className="inline-flex justify-center items-center rounded-lg bg-brand-green px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-green-hover transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Create Assessment
          </Link>
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
          <p className="mt-2 text-xs text-neutral-400">Get started by creating or importing your first test.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <label className="inline-flex justify-center items-center rounded-lg border border-brand-green bg-white px-4 py-2 text-xs font-bold text-brand-green hover:bg-brand-green-light/20 transition-colors shadow-xs cursor-pointer">
              Import (JSON / CSV)
              <input type="file" accept=".json,.csv" onChange={handleFileUpload} disabled={importing} className="hidden" />
            </label>
            <Link
              href="/dashboard/assessments/new"
              className="inline-flex items-center rounded-lg bg-brand-green px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-green-hover"
            >
              Create Manually
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
                  <button
                    onClick={() => handleExportAssessment(a.id, a.title)}
                    className="rounded-md border border-brand-green bg-white p-1.5 text-brand-green hover:bg-brand-green-light/20 transition-colors shadow-2xs"
                    title="Export JSON Package"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
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
                    onClick={() => setDeleteModalId(a.id)}
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-neutral-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* On-Screen Import Validation Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-red-100 space-y-4">
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
                  ⚠️
                </div>
                <h2 className="text-base font-bold text-neutral-900">Import Validation Errors</h2>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              The file could not be uploaded because the following requirement issues were found. Please fix them in your CSV or JSON file and try again.
            </p>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {validationErrors.map((vErr, idx) => (
                <div key={idx} className="rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-1">
                  <h4 className="text-xs font-bold text-red-900">{vErr.itemTitle}</h4>
                  <ul className="list-disc list-inside text-3xs text-red-700 space-y-0.5">
                    {vErr.errors.map((errText, eIdx) => (
                      <li key={eIdx}>{errText}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end border-t border-neutral-100 pt-3">
              <button
                onClick={() => setShowErrorModal(false)}
                className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Dismiss & Fix File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteModalId}
        title="Delete Assessment"
        message="Are you sure you want to delete this assessment? This action cannot be undone and will remove all associated invitations and candidate attempts."
        confirmText="Yes, Delete Assessment"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalId(null)}
      />
    </div>
  );
}

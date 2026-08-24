'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../../utils/api';
import { useToast } from '../../../../context/ToastContext';

interface MCQQuestion {
  type: 'MCQ' | 'CODING' | 'SIMPLE';
  text: string;
  // MCQ fields
  optA?: string;
  optB?: string;
  optC?: string;
  optD?: string;
  correct?: 'A' | 'B' | 'C' | 'D';
  // Coding fields
  codeTemplate?: string;
  language?: string;
}

export default function NewAssessmentPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  // Core fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assessmentType, setAssessmentType] = useState('Technical Interview');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingScore, setPassingScore] = useState(70);

  // Instructions & Guidelines
  const [instructions, setInstructions] = useState('Please maintain focus on the screen throughout the examination.');
  const [allowedInput, setAllowedInput] = useState('Calculator, Blank paper');
  const [prohibitedInput, setProhibitedInput] = useState('Mobile phone, Dual monitors, Textbooks');

  // Schedule fields
  const [examDate, setExamDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  // Rules fields (custom proctor parameters)
  const [identityVerificationEnabled, setIdentityVerificationEnabled] = useState(true);
  const [personDetectionEnabled, setPersonDetectionEnabled] = useState(true);
  const [objectDetectionEnabled, setObjectDetectionEnabled] = useState(true);
  const [headGazeMonitoringEnabled, setHeadGazeMonitoringEnabled] = useState(true);
  const [voiceMonitoringEnabled, setVoiceMonitoringEnabled] = useState(false);
  const [fullscreenMonitoringEnabled, setFullscreenMonitoringEnabled] = useState(true);
  const [maxTabSwitches, setMaxTabSwitches] = useState(5);

  // Dynamic Questions (Mixed types)
  const [questions, setQuestions] = useState<MCQQuestion[]>([
    {
      type: 'MCQ',
      text: 'Which hook is used to run side effects in React?',
      optA: 'useState',
      optB: 'useEffect',
      optC: 'useContext',
      optD: 'useReducer',
      correct: 'B',
    }
  ]);

  const [saving, setSaving] = useState(false);

  const handleAddQuestion = (type: 'MCQ' | 'CODING' | 'SIMPLE') => {
    setQuestions(prev => [
      ...prev,
      {
        type,
        text: '',
        optA: type === 'MCQ' ? '' : undefined,
        optB: type === 'MCQ' ? '' : undefined,
        optC: type === 'MCQ' ? '' : undefined,
        optD: type === 'MCQ' ? '' : undefined,
        correct: type === 'MCQ' ? 'A' : undefined,
        codeTemplate: type === 'CODING' ? '// Write your solution here' : undefined,
        language: type === 'CODING' ? 'JavaScript' : undefined,
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleQuestionChange = (index: number, key: keyof MCQQuestion, val: string) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx === index) {
        return { ...q, [key]: val };
      }
      return q;
    }));
  };

  // Export questions to CSV
  const handleExportQuestionsCsv = () => {
    const headers = 'Type,Text,OptionA,OptionB,OptionC,OptionD,CorrectOption,CodeTemplate,Language\n';
    const rows = questions
      .map(q => {
        const type = q.type;
        const text = `"${(q.text || '').replace(/"/g, '""')}"`;
        const a = q.type === 'MCQ' ? `"${(q.optA || '').replace(/"/g, '""')}"` : '""';
        const b = q.type === 'MCQ' ? `"${(q.optB || '').replace(/"/g, '""')}"` : '""';
        const c = q.type === 'MCQ' ? `"${(q.optC || '').replace(/"/g, '""')}"` : '""';
        const d = q.type === 'MCQ' ? `"${(q.optD || '').replace(/"/g, '""')}"` : '""';
        const correct = q.type === 'MCQ' ? `"${q.correct || 'A'}"` : '""';
        const template = q.type === 'CODING' ? `"${(q.codeTemplate || '').replace(/"/g, '""')}"` : '""';
        const lang = q.type === 'CODING' ? `"${q.language || 'JavaScript'}"` : '""';

        return `${type},${text},${a},${b},${c},${d},${correct},${template},${lang}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'proctor_questions_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastSuccess('Questions list exported to CSV.');
  };

  // Import questions from CSV
  const handleImportQuestionsCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const imported: MCQQuestion[] = [];

      lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return; // Skip headers

        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length >= 2) {
          const type = cols[0] as 'MCQ' | 'CODING' | 'SIMPLE';
          if (type === 'MCQ' || type === 'CODING' || type === 'SIMPLE') {
            imported.push({
              type,
              text: cols[1],
              optA: type === 'MCQ' ? cols[2] : undefined,
              optB: type === 'MCQ' ? cols[3] : undefined,
              optC: type === 'MCQ' ? cols[4] : undefined,
              optD: type === 'MCQ' ? cols[5] : undefined,
              correct: type === 'MCQ' ? (cols[6] as 'A'|'B'|'C'|'D') : undefined,
              codeTemplate: type === 'CODING' ? cols[7] : undefined,
              language: type === 'CODING' ? cols[8] : undefined,
            });
          }
        }
      });

      if (imported.length > 0) {
        setQuestions(prev => [...prev, ...imported]);
        toastSuccess(`Successfully imported ${imported.length} questions from CSV.`);
      } else {
        toastError('Failed to parse questions CSV. Check column mapping.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toastError('Please specify an assessment title.');
      return;
    }

    if (questions.length === 0) {
      toastError('Please add at least one question.');
      return;
    }

    setSaving(true);
    try {
      const allowedMaterials = allowedInput.split(',').map(m => m.trim()).filter(Boolean);
      const prohibitedMaterials = prohibitedInput.split(',').map(m => m.trim()).filter(Boolean);

      // Step 1: Create draft assessment
      const assessment = await apiRequest<{ id: string }>('assessments', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description: description || undefined,
          assessmentType,
          durationMinutes,
          passingScore,
          instructions,
          allowedMaterials,
          prohibitedMaterials,
        }),
      });

      if (!assessment || !assessment.id) {
        throw new Error('Failed to retrieve assessment ID during creation.');
      }

      const assessmentId = assessment.id;

      // Step 2: Schedule the times
      const datePart = examDate;
      const startDateTime = new Date(`${datePart}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${datePart}T${endTime}:00`).toISOString();

      await apiRequest(`assessments/${assessmentId}/schedule`, {
        method: 'PATCH',
        body: JSON.stringify({
          examDate: startDateTime,
          startTime: startDateTime,
          endTime: endDateTime,
        }),
      });

      // Step 3: Configure proctor rules
      await apiRequest(`assessments/${assessmentId}/rules`, {
        method: 'PATCH',
        body: JSON.stringify({
          identityVerificationEnabled,
          personDetectionEnabled,
          objectDetectionEnabled,
          headGazeMonitoringEnabled,
          voiceMonitoringEnabled,
          fullscreenMonitoringEnabled,
          maxTabSwitches,
        }),
      });

      // Step 4: Bulk upload mixed questions
      const formattedQuestions = questions.map((q, idx) => {
        const questionObj: {
          questionType: 'MCQ' | 'CODING' | 'SIMPLE';
          questionText: string;
          marks: number;
          orderNumber: number;
          options?: { optionText: string; optionLabel: string; isCorrect: boolean; orderNumber: number }[];
        } = {
          questionType: q.type,
          questionText: q.type === 'CODING' 
            ? `${q.text}\n\n[Language: ${q.language}]\n\n\`\`\`\n${q.codeTemplate || ''}\n\`\`\``
            : q.text,
          marks: 1,
          orderNumber: idx + 1,
        };

        if (q.type === 'MCQ') {
          questionObj.options = [
            { optionText: q.optA || '', optionLabel: 'A', isCorrect: q.correct === 'A', orderNumber: 1 },
            { optionText: q.optB || '', optionLabel: 'B', isCorrect: q.correct === 'B', orderNumber: 2 },
            { optionText: q.optC || '', optionLabel: 'C', isCorrect: q.correct === 'C', orderNumber: 3 },
            { optionText: q.optD || '', optionLabel: 'D', isCorrect: q.correct === 'D', orderNumber: 4 },
          ];
        }

        return questionObj;
      });

      await apiRequest(`assessments/${assessmentId}/questions/bulk`, {
        method: 'POST',
        body: JSON.stringify({ questions: formattedQuestions }),
      });

      toastSuccess('Assessment successfully created and published!');
      router.push('/dashboard/assessments');
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Error occurred while publishing assessment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Create New Assessment</h1>
        <p className="mt-1 text-sm text-neutral-500">Deploy a secure proctored exam with custom questions and materials constraints.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Left panel: Core fields & Questions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Core Info */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-800 border-b border-neutral-50 pb-2">1. Core Information</h2>
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-neutral-700">
                  Assessment Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Fullstack Engineer Midterm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                />
              </div>

              {/* Grid parameters */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Type */}
                <div className="sm:col-span-1">
                  <label htmlFor="type" className="block text-sm font-semibold text-neutral-700">
                    Exam Type
                  </label>
                  <select
                    id="type"
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none"
                  >
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Academic Exam">Academic Exam</option>
                    <option value="Certification">Certification</option>
                    <option value="Aptitude Test">Aptitude Test</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-semibold text-neutral-700">
                    Duration (Minutes)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                  />
                </div>

                {/* Passing Score */}
                <div>
                  <label htmlFor="passing" className="block text-sm font-semibold text-neutral-700">
                    Passing Score (%)
                  </label>
                  <input
                    id="passing"
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-neutral-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={2}
                  placeholder="Provide brief details about the target candidates or skills tested..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 2. Guidelines & Environmental Materials */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-800 border-b border-neutral-50 pb-2">2. Instructions & Exam Environment Rules</h2>
              
              <div>
                <label htmlFor="instructions" className="block text-sm font-semibold text-neutral-700">
                  Instructions for Candidate
                </label>
                <textarea
                  id="instructions"
                  rows={2}
                  placeholder="Instructions displayed to candidates before taking test..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="allowed" className="block text-sm font-semibold text-neutral-700">
                    Allowed Materials <span className="text-xs text-neutral-400">(Comma separated)</span>
                  </label>
                  <input
                    id="allowed"
                    type="text"
                    placeholder="e.g. Calculator, Pen, Blank paper"
                    value={allowedInput}
                    onChange={(e) => setAllowedInput(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="prohibited" className="block text-sm font-semibold text-neutral-700">
                    Prohibited Items <span className="text-xs text-neutral-400">(Comma separated)</span>
                  </label>
                  <input
                    id="prohibited"
                    type="text"
                    placeholder="e.g. Mobile phone, Dual screen, Headset"
                    value={prohibitedInput}
                    onChange={(e) => setProhibitedInput(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Mixed Question Builder with CSV imports */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-50 pb-2">
                <div>
                  <h2 className="text-base font-bold text-neutral-800">3. Questions Workspace</h2>
                  <p className="text-2xs text-neutral-400 font-semibold mt-0.5">Select a type below to add a question.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={handleExportQuestionsCsv}
                    className="inline-flex justify-center items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Export CSV
                  </button>

                  {/* Import CSV */}
                  <label className="inline-flex justify-center items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">
                    Import CSV
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportQuestionsCsv}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Selector buttons to add specific question type */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('MCQ')}
                  className="rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 text-xs font-bold text-brand-green cursor-pointer"
                >
                  + Add MCQ Question
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('CODING')}
                  className="rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 text-xs font-bold text-blue-700 cursor-pointer"
                >
                  + Add Coding Question
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('SIMPLE')}
                  className="rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 text-xs font-bold text-amber-700 cursor-pointer"
                >
                  + Add Simple Question
                </button>
              </div>

              {questions.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-6">No questions added yet. Use the selector buttons to add one.</p>
              ) : (
                <div className="space-y-6 pt-2">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/20 space-y-4 relative">
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Question Header & Type Indicators */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-500">Question #{idx + 1}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-3xs font-extrabold ${
                          q.type === 'MCQ'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : q.type === 'CODING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {q.type}
                        </span>
                      </div>

                      {/* Question Text */}
                      <div>
                        <label className="block text-2xs font-semibold text-neutral-500 mb-1">Question Description</label>
                        <input
                          type="text"
                          required
                          placeholder="What is the question text or prompt?"
                          value={q.text}
                          onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                          className="block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-brand-green focus:outline-none"
                        />
                      </div>

                      {/* Render MCQ Fields */}
                      {q.type === 'MCQ' && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {['A', 'B', 'C', 'D'].map((label) => {
                              const optionKey = `opt${label}` as keyof MCQQuestion;
                              return (
                                <div key={label} className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-neutral-400">{label}.</span>
                                  <input
                                    type="text"
                                    required
                                    placeholder={`Option ${label}`}
                                    value={q[optionKey] || ''}
                                    onChange={(e) => handleQuestionChange(idx, optionKey, e.target.value)}
                                    className="block w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 focus:border-brand-green focus:outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-semibold text-neutral-500">Correct Option:</span>
                            <select
                              value={q.correct || 'A'}
                              onChange={(e) => handleQuestionChange(idx, 'correct', e.target.value)}
                              className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-2xs text-neutral-900 focus:border-brand-green focus:outline-none font-bold"
                            >
                              <option value="A">Option A</option>
                              <option value="B">Option B</option>
                              <option value="C">Option C</option>
                              <option value="D">Option D</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Render Coding Fields */}
                      {q.type === 'CODING' && (
                        <div className="grid grid-cols-1 gap-3 pt-1">
                          <div>
                            <label className="block text-2xs font-semibold text-neutral-500 mb-1">Target Language</label>
                            <select
                              value={q.language || 'JavaScript'}
                              onChange={(e) => handleQuestionChange(idx, 'language', e.target.value)}
                              className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-2xs text-neutral-900 focus:border-brand-green focus:outline-none font-bold"
                            >
                              <option value="JavaScript">JavaScript</option>
                              <option value="Python">Python</option>
                              <option value="C++">C++</option>
                              <option value="Java">Java</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-2xs font-semibold text-neutral-500 mb-1">Initial Code Template</label>
                            <textarea
                              rows={3}
                              placeholder="// Write boilerplate or function templates here"
                              value={q.codeTemplate || ''}
                              onChange={(e) => handleQuestionChange(idx, 'codeTemplate', e.target.value)}
                              className="block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-brand-green focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Render Simple Fields */}
                      {q.type === 'SIMPLE' && (
                        <div className="pt-1">
                          <p className="text-3xs text-neutral-400 font-semibold italic">Candidates will be provided a free-form rich-text entry space to write their answer description.</p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Scheduling & Rules */}
          <div className="space-y-6">
            
            {/* Schedule */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-800 border-b border-neutral-50 pb-2">4. Scheduling</h2>
              <div className="space-y-3">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-xs font-semibold text-neutral-500">
                    Exam Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none"
                  />
                </div>
                {/* Start Time */}
                <div>
                  <label htmlFor="start" className="block text-xs font-semibold text-neutral-500">
                    Start Window
                  </label>
                  <input
                    id="start"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none"
                  />
                </div>
                {/* End Time */}
                <div>
                  <label htmlFor="end" className="block text-xs font-semibold text-neutral-500">
                    End Window
                  </label>
                  <input
                    id="end"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:ring-1 focus:ring-brand-green focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Proctoring Rules */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-neutral-800 border-b border-neutral-50 pb-2">5. Proctoring Engine</h2>
              
              <div className="space-y-4">
                {/* Identity check */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">Identity Verification</span>
                    <span className="text-2xs text-neutral-400">Verifies candidate&apos;s face before exam</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={identityVerificationEnabled}
                    onChange={(e) => setIdentityVerificationEnabled(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
                  />
                </div>

                {/* Person detection */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">Second Person Alert</span>
                    <span className="text-2xs text-neutral-400">Alerts if multiple faces appear</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={personDetectionEnabled}
                    onChange={(e) => setPersonDetectionEnabled(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
                  />
                </div>

                {/* Object detection */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">Object Detection</span>
                    <span className="text-2xs text-neutral-400">Detects cellphones, materials, etc.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={objectDetectionEnabled}
                    onChange={(e) => setObjectDetectionEnabled(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
                  />
                </div>

                {/* Gaze Monitoring */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">Gaze Tracking</span>
                    <span className="text-2xs text-neutral-400">Flags candidate looking away</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={headGazeMonitoringEnabled}
                    onChange={(e) => setHeadGazeMonitoringEnabled(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
                  />
                </div>

                {/* Voice monitoring */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">Voice Monitoring</span>
                    <span className="text-2xs text-neutral-400">Listens for whispering or audio help</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={voiceMonitoringEnabled}
                    onChange={(e) => setVoiceMonitoringEnabled(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
                  />
                </div>

                {/* Fullscreen check */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-800">Fullscreen Focus</span>
                    <span className="text-2xs text-neutral-400">Enforces full screen locking</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={fullscreenMonitoringEnabled}
                    onChange={(e) => setFullscreenMonitoringEnabled(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
                  />
                </div>

                {/* Max tab switches */}
                <div className="pt-2 border-t border-neutral-50">
                  <label htmlFor="tab" className="block text-xs font-semibold text-neutral-500">
                    Max Tab Switches Allowed
                  </label>
                  <input
                    id="tab"
                    type="number"
                    min="0"
                    max="20"
                    value={maxTabSwitches}
                    onChange={(e) => setMaxTabSwitches(parseInt(e.target.value) || 0)}
                    className="mt-2 block w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-brand-green focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Block */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center items-center rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-hover transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {saving ? 'Creating Assessment...' : 'Create & Publish'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/assessments')}
                className="w-full flex justify-center items-center rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

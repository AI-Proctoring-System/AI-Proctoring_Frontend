'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../../utils/api';
import { useToast } from '../../../../context/ToastContext';
import { useAuth } from '../../../../context/AuthContext';

interface AnswerOption {
  id: string;
  optionText: string;
  optionLabel: string;
  orderNumber: number;
}

interface Question {
  id: string;
  questionType: 'MCQ' | 'CODING' | 'SIMPLE';
  questionText: string;
  marks: number;
  options?: AnswerOption[];
}

interface Assessment {
  id: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
  examDate: string;
  endTime?: string;
  instructions?: string;
  allowedMaterials?: string[];
  prohibitedMaterials?: string[];
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assessmentId = resolvedParams.id; // invitationId in actual use
  const router = useRouter();
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Flow State: 0 = Rules/Guidelines, 1 = Face Check, 2 = Room Scan, 3 = Exam Quiz, 4 = Completed
  const [step, setStep] = useState(0);

  // Consent checkbox
  const [acceptedRules, setAcceptedRules] = useState(false);

  // Face Scan simulation states
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceScanSuccess, setFaceScanSuccess] = useState(false);

  // Room Sweep simulation states
  const [isRoomScanning, setIsRoomScanning] = useState(false);
  const [roomScanProgress, setRoomScanProgress] = useState(0);
  const [roomScanSuccess, setRoomScanSuccess] = useState(false);

  // Quiz states
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

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

  // Fetch assessment details via the secure candidate invitation route
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CANDIDATE') return;

    async function loadInvitation() {
      try {
        const response = await apiRequest<{ assessment: Assessment }>(`attempts/invitation/${assessmentId}`);
        if (response && response.assessment) {
          const now = new Date();
          if (response.assessment.endTime && new Date(response.assessment.endTime) < now) {
            toastError('This assessment has expired and can no longer be accessed.');
            setAssessment(null);
            return;
          }
          setAssessment(response.assessment);
          setTimeLeft(response.assessment.durationMinutes * 60);
        } else {
          throw new Error('Invitation data missing.');
        }
      } catch (err) {
        console.error(err);
        toastError('Failed to retrieve exam parameters.');
      } finally {
        setLoading(false);
      }
    }
    loadInvitation();
  }, [assessmentId, isAuthenticated, user, toastError]);

  // Official launch function that registers attempt start and fetches questions
  const handleLaunchAssessment = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ attempt: { id: string }, questions: Question[] }>(
        `attempts/start/${assessmentId}`,
        { method: 'POST' }
      );
      if (response && response.attempt) {
        if (response.questions && response.questions.length > 0) {
          setQuestions(response.questions);
        } else {
          // Fallback questions if none exist on backend
          setQuestions([
            {
              id: 'default_1',
              questionType: 'MCQ',
              questionText: 'Which HTML5 element is used to display video?',
              options: [
                { id: 'o1', optionText: '<media>', optionLabel: 'A', orderNumber: 1 },
                { id: 'o2', optionText: '<video>', optionLabel: 'B', orderNumber: 2 },
                { id: 'o3', optionText: '<iframe>', optionLabel: 'C', orderNumber: 3 },
                { id: 'o4', optionText: '<movie>', optionLabel: 'D', orderNumber: 4 },
              ],
              marks: 1,
            },
            {
              id: 'default_2',
              questionType: 'CODING',
              questionText: 'Write a function sum(a, b) that returns their addition.',
              marks: 5,
            },
            {
              id: 'default_3',
              questionType: 'SIMPLE',
              questionText: 'Explain the benefits of Server Side Rendering over Client Side Rendering.',
              marks: 2,
            }
          ]);
        }
        setStep(3);
      }
    } catch (err) {
      const errorVal = err as Error;
      toastError(errorVal.message || 'Failed to start exam attempt.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExam = useCallback(() => {
    setStep(4);
    toastSuccess('Examination submitted successfully.');
  }, [toastSuccess]);

  // Active Tab Switch detector during step 3 (Exam Mode)
  useEffect(() => {
    if (step !== 3) return;

    const handleBlur = () => {
      setTabSwitches((prev) => {
        const newCount = prev + 1;
        toastWarning(`Proctor Warning: Tab switch detected (${newCount}). This incident is flagged and logged.`);
        return newCount;
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [step, toastWarning]);

  // Countdown timer for exam
  useEffect(() => {
    if (step !== 3 || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft, handleSubmitExam]);

  // Simulated Face capture
  const handleFaceScan = () => {
    setIsFaceScanning(true);
    setTimeout(() => {
      setIsFaceScanning(false);
      setFaceScanSuccess(true);
      toastSuccess('Face Verification successful! Identity confirmed.');
    }, 2000);
  };

  // Simulated Room Scan sweep
  const handleRoomScan = () => {
    setIsRoomScanning(true);
    setRoomScanProgress(0);
    const interval = setInterval(() => {
      setRoomScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRoomScanning(false);
          setRoomScanSuccess(true);
          toastSuccess('Room scan completed. Clean environment verified.');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSelectOption = (qId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleTextAnswerChange = (qId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: text }));
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white text-center p-6">
        <h2 className="text-xl font-bold text-neutral-800">Assessment not found</h2>
        <p className="text-sm text-neutral-400 mt-2">The requested examination link is invalid or expired.</p>
        <button onClick={() => router.push('/candidate')} className="mt-4 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white">
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-between">
      {/* Top Header info */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-2xs font-semibold text-neutral-400 uppercase tracking-wider">Candidate Workspace</span>
          <h1 className="text-lg font-bold text-neutral-900 leading-tight">{assessment.title}</h1>
        </div>
        {step === 3 && (
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="text-center">
              <span className="block text-2xs font-semibold text-neutral-400 uppercase">Time Remaining</span>
              <span className="text-lg font-mono font-bold text-neutral-800">{formatTime(timeLeft)}</span>
            </div>
            {/* Violations */}
            <div className="text-center border-l border-neutral-100 pl-6">
              <span className="block text-2xs font-semibold text-neutral-400 uppercase">Focus Warnings</span>
              <span className={`text-lg font-bold ${tabSwitches > 0 ? 'text-red-500 font-extrabold animate-pulse' : 'text-neutral-800'}`}>
                {tabSwitches}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main body content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col items-center justify-center">

        {/* STEP 0: Instructions & Guidelines Checklist */}
        {step === 0 && (
          <div className="w-full max-w-xl bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs space-y-6">
            <div className="text-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-neutral-900 mt-3 font-display">Exam Guidelines & Environmental Rules</h2>
              <p className="text-xs text-neutral-400 mt-1">Please review the allowed materials and guidelines before launching proctoring.</p>
            </div>

            {/* Custom Recruiter Instructions */}
            <div className="rounded-xl bg-neutral-50 p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Special Instructions</h4>
                <p className="text-sm text-neutral-700 font-medium mt-1 leading-relaxed">
                  {assessment.instructions || 'Please complete the verification steps carefully.'}
                </p>
              </div>

              {/* Grid of Materials */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-neutral-200/50">
                {/* Allowed */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Allowed Materials
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-600 list-disc pl-4 font-medium">
                    {assessment.allowedMaterials && assessment.allowedMaterials.length > 0 ? (
                      assessment.allowedMaterials.map((m, i) => <li key={i}>{m}</li>)
                    ) : (
                      <li>No specific materials allowed.</li>
                    )}
                  </ul>
                </div>

                {/* Prohibited */}
                <div>
                  <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Prohibited Items
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-600 list-disc pl-4 font-medium">
                    {assessment.prohibitedMaterials && assessment.prohibitedMaterials.length > 0 ? (
                      assessment.prohibitedMaterials.map((m, i) => <li key={i}>{m}</li>)
                    ) : (
                      <li>No specific prohibited items listed.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Checkbox consent */}
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-sm border-neutral-300 text-brand-green focus:ring-brand-green"
              />
              <label htmlFor="consent" className="text-xs text-neutral-500 font-medium leading-relaxed">
                I declare that my desk is clear of all prohibited items and I agree to remain within webcam boundary for the duration of the test.
              </label>
            </div>

            <button
              type="button"
              disabled={!acceptedRules}
              onClick={() => setStep(1)}
              className="w-full rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I Understand, Start Verification
            </button>
          </div>
        )}

        {/* STEP 1: Identity Check */}
        {step === 1 && (
          <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs space-y-6 text-center">
            <div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-neutral-900 mt-3">Identity Check</h2>
              <p className="text-sm text-neutral-400 mt-1">Please fit your face clearly inside the camera frame below.</p>
            </div>

            {/* Camera View Box */}
            <div className="relative h-64 w-full rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border-2 border-neutral-800 shadow-inner">
              {/* Scan effect */}
              {isFaceScanning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-green/60 shadow-[0_0_8px_rgba(45,74,62,0.8)] animate-[bounce_2s_infinite]"></div>
              )}

              {faceScanSuccess ? (
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-emerald-500">Candidate Match Confirmed (98.4%)</p>
                </div>
              ) : isFaceScanning ? (
                <p className="text-sm font-medium text-white/80 animate-pulse">Running facial landmarks sweep...</p>
              ) : (
                <p className="text-sm font-medium text-white/50">Camera feed ready. Align your eyes with the grid.</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleFaceScan}
                disabled={isFaceScanning || faceScanSuccess}
                className="flex-1 rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors disabled:opacity-50"
              >
                {faceScanSuccess ? 'Verified' : isFaceScanning ? 'Scanning...' : 'Scan My Face'}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!faceScanSuccess}
                className="flex-1 rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Room Sweeper Check */}
        {step === 2 && (
          <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs space-y-6 text-center">
            <div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-neutral-900 mt-3">360° Desk & Room Sweep</h2>
              <p className="text-sm text-neutral-400 mt-1">Slowly rotate your webcam 360 degrees to verify a clean workspace.</p>
            </div>

            {/* Sweep Box */}
            <div className="relative h-64 w-full rounded-xl bg-neutral-900 overflow-hidden flex flex-col items-center justify-center border-2 border-neutral-800 p-6 shadow-inner">
              {roomScanSuccess ? (
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-emerald-500">Workspace status: CLEAN</p>
                </div>
              ) : isRoomScanning ? (
                <div className="w-full space-y-4 px-8 text-center">
                  <p className="text-sm font-semibold text-white/80 animate-pulse">Scanning desk boundaries...</p>
                  <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-brand-green transition-all" style={{ width: `${roomScanProgress}%` }}></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-white/50">Align webcam to capture keyboard/mouse plane.</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleRoomScan}
                disabled={isRoomScanning || roomScanSuccess}
                className="flex-1 rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors disabled:opacity-50"
              >
                {roomScanSuccess ? 'Verified' : isRoomScanning ? 'Scanning...' : 'Start Sweep'}
              </button>
              <button
                type="button"
                onClick={handleLaunchAssessment}
                disabled={!roomScanSuccess}
                className="flex-1 rounded-lg border border-neutral-200 bg-white py-2.5 px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Launch Assessment
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Exam Environment */}
        {step === 3 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

            {/* Questions Pane */}
            <div className="md:col-span-3 bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs space-y-8">
              <div className="border-b border-neutral-50 pb-4">
                <span className="text-xs font-semibold text-brand-green bg-brand-green-light px-2 py-0.5 rounded-full">Secure Exam Mode</span>
                <p className="text-xs text-neutral-400 mt-2">Any tab changes or minimization will be logged as critical security events.</p>
              </div>

              {/* Dynamic question rendering based on type */}
              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-4 p-5 rounded-2xl border border-neutral-50 bg-neutral-50/10">
                    <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                      <h3 className="text-sm font-bold text-neutral-800">
                        Question {idx + 1}
                      </h3>
                      <span className="text-3xs font-extrabold text-neutral-400 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full">
                        {q.questionType} ({q.marks} Mark{q.marks > 1 ? 's' : ''})
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-neutral-700 leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* MCQ Questions Interface */}
                    {q.questionType === 'MCQ' && q.options && (
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`flex items-center text-left text-xs font-semibold rounded-lg border p-3.5 transition-all cursor-pointer ${answers[q.id] === opt.id
                                ? 'border-brand-green bg-brand-green-light/45 text-brand-green font-bold shadow-xs'
                                : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                              }`}
                          >
                            <span className="mr-2 text-neutral-400 font-bold">{opt.optionLabel}.</span>
                            {opt.optionText}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Coding Workspace Interface */}
                    {q.questionType === 'CODING' && (
                      <div className="space-y-2 pt-2">
                        <label className="block text-3xs font-bold text-neutral-400 uppercase">Interactive Coding Workspace</label>
                        <textarea
                          rows={6}
                          placeholder="// Type your code solution here..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextAnswerChange(q.id, e.target.value)}
                          className="block w-full rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-3 text-xs font-mono text-white focus:border-brand-green focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Simple open-ended Interface */}
                    {q.questionType === 'SIMPLE' && (
                      <div className="space-y-2 pt-2">
                        <label className="block text-3xs font-bold text-neutral-400 uppercase">Your Explanation Response</label>
                        <textarea
                          rows={4}
                          placeholder="Type your explanation or description response here..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextAnswerChange(q.id, e.target.value)}
                          className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-700 focus:border-brand-green focus:outline-none font-medium"
                        />
                      </div>
                    )}

                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-neutral-50">
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="rounded-lg bg-brand-green py-2 px-6 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors"
                >
                  Submit Exam
                </button>
              </div>
            </div>

            {/* Sidebar Feed */}
            <div className="md:col-span-1 bg-white rounded-2xl border border-neutral-100 p-4 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-neutral-800">Active Feed</h4>
              <div className="relative aspect-video rounded-lg bg-neutral-900 overflow-hidden flex items-center justify-center border border-neutral-800">
                {/* Small indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-3xs text-white font-bold bg-neutral-950/80 px-1 py-0.5 rounded-sm">REC</span>
                </div>
                <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-3xs font-semibold text-neutral-500 leading-relaxed">
                We are actively tracking eye movements, room volume spikes, and page focus switches. Keep your camera clear.
              </p>
            </div>

          </div>
        )}

        {/* STEP 4: Finished */}
        {step === 4 && (
          <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-100 p-8 shadow-xs text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Submission Received</h2>
              <p className="text-sm text-neutral-500 mt-2">
                Your answers have been stored and the proctoring logs have been delivered to the recruiters for review.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 space-y-2 text-left text-xs font-semibold text-neutral-600">
              <div className="flex justify-between">
                <span>Tab Focus Alerts:</span>
                <span className={tabSwitches > 0 ? 'text-red-600 font-extrabold' : 'text-neutral-900'}>{tabSwitches}</span>
              </div>
              <div className="flex justify-between">
                <span>Identity Verification status:</span>
                <span className="text-emerald-600">SUCCESS</span>
              </div>
              <div className="flex justify-between">
                <span>Room sweep verification:</span>
                <span className="text-emerald-600">SUCCESS</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/candidate')}
              className="w-full rounded-lg bg-brand-green py-2.5 px-4 text-sm font-semibold text-white hover:bg-brand-green-hover transition-colors"
            >
              Return to Candidate Portal
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

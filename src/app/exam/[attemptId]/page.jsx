'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Clock, Lock, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExamPage() {
  const { attemptId } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState('SECTION_1_ACTIVE');
  const [questions, setQuestions] = useState([]);
  const [endsAt, setEndsAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(5400); // 90 mins default

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: "A" }
  const [markedForReview, setMarkedForReview] = useState({}); // { questionId: true }
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Normalize Java LocalDateTime (UTC inside Docker) or fallback to +90 mins
  const resolveTargetTime = useCallback((rawEndsAt) => {
    if (!rawEndsAt) return Date.now() + 90 * 60 * 1000;

    // Append 'Z' if Java LocalDateTime serialized without timezone offset
    const normalized =
      typeof rawEndsAt === 'string' && !rawEndsAt.endsWith('Z') && !rawEndsAt.includes('+')
        ? `${rawEndsAt}Z`
        : rawEndsAt;

    const parsedMs = new Date(normalized).getTime();

    // Guard against missing/past timestamps so the exam never auto-closes at 0s
    if (Number.isNaN(parsedMs) || parsedMs <= Date.now() + 5000) {
      return Date.now() + 90 * 60 * 1000;
    }
    return parsedMs;
  }, []);

  // Load initial section payload saved when starting the test on /dashboard
  useEffect(() => {
    const cached = sessionStorage.getItem(`exam_${attemptId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      const targetMs = resolveTargetTime(parsed.endsAt || parsed.sectionEndsAt);
      setStatus(parsed.status || 'SECTION_1_ACTIVE');
      setQuestions(parsed.questions || []);
      setEndsAt(targetMs);
      setSecondsLeft(Math.max(1, Math.floor((targetMs - Date.now()) / 1000)));
    }
  }, [attemptId, resolveTargetTime]);

  // 1. Handle Section 1 -> Section 2 Lock & Transition
  const handleNextSection = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/attempts/${attemptId}/next-section`);
      const data = res.data;
      const targetMs = resolveTargetTime(data.endsAt || data.sectionEndsAt);

      setStatus(data.status || 'SECTION_2_ACTIVE');
      setQuestions(data.questions || []);
      setEndsAt(targetMs);
      setSecondsLeft(Math.max(1, Math.floor((targetMs - Date.now()) / 1000)));
      setCurrentIndex(0);
      sessionStorage.setItem(`exam_${attemptId}`, JSON.stringify(data));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to transition to Section 2');
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, submitting, resolveTargetTime]);

  // 2. Handle Final Submission -> Redirect to Evaluation Result Page
  const handleFinalSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post(`/attempts/${attemptId}/submit`);
      sessionStorage.removeItem(`exam_${attemptId}`);
      router.push(`/result/${attemptId}`);
    } catch (err) {
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  }, [attemptId, router, submitting]);

  // 3. Live 90-Minute Countdown
  useEffect(() => {
    if (!endsAt) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setSecondsLeft(diff);

      if (diff === 0) {
        clearInterval(interval);
        if (status === 'SECTION_1_ACTIVE') {
          handleNextSection();
        } else if (status === 'SECTION_2_ACTIVE') {
          handleFinalSubmit();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt, status, handleNextSection, handleFinalSubmit]);

  // 4. Auto-Save Selected Option to Test Engine Service
  const handleSelectOption = async (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setSaving(true);
    try {
      await api.put(`/attempts/${attemptId}/answer`, null, {
        params: { questionId, option: optionId },
      });
    } catch (err) {
      alert('Time expired or session locked! Could not save answer.');
    } finally {
      setSaving(false);
    }
  };

  const toggleReview = (questionId) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const formatTime = (totalSec) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <p>Loading MHT-CET Exam Paper... (Ensure questions exist in Question Bank)</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top CBT Exam Bar */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            MHT-CET Computer-Based Mock Test
          </span>
          <h1 className="text-lg font-bold flex items-center gap-2">
            {status === 'SECTION_1_ACTIVE'
              ? 'Section 1: Physics & Chemistry (90 Mins)'
              : 'Section 2: Mathematics / Biology (90 Mins)'}
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Section Locked on Submit
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">{saving ? 'Saving...' : 'All answers synced'}</span>

          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-lg font-bold ${
              secondsLeft < 300 ? 'bg-red-600 animate-pulse' : 'bg-slate-800 text-emerald-400'
            }`}
          >
            <Clock className="w-5 h-5" />
            {formatTime(secondsLeft)}
          </div>

          {status === 'SECTION_1_ACTIVE' ? (
            <button
              onClick={handleNextSection}
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              {submitting ? 'Locking...' : 'Finish Section 1 & Unlock Section 2'}
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              {submitting ? 'Submitting...' : 'Submit Final Exam'}
            </button>
          )}
        </div>
      </header>

      {/* Main Split-Screen CBT Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 max-w-7xl w-full mx-auto">
        {/* Left 3 Columns: Question & Options */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-slate-800">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {currentQuestion.subject} • Std {currentQuestion.standard}
                </span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded bg-emerald-50 text-emerald-700">
                +{currentQuestion.marks} {currentQuestion.marks === 2 ? 'Marks' : 'Mark'} | 0 Negative
              </span>
            </div>

            <p className="text-base md:text-lg text-slate-800 leading-relaxed mb-6">
              {currentQuestion.questionText}
            </p>

            {/* 4 Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.optionId;
                return (
                  <button
                    key={opt.optionId}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.optionId)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt.optionId}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t">
            <button
              onClick={() => toggleReview(currentQuestion.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 text-sm font-medium"
            >
              <Flag className="w-4 h-4" />
              {markedForReview[currentQuestion.id] ? 'Unmark Review' : 'Mark for Review'}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 text-sm font-medium"
              >
                Save & Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <aside className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
          <h2 className="font-bold text-sm text-slate-700 uppercase tracking-wide mb-3">
            Question Palette
          </h2>

          <div className="grid grid-cols-3 gap-2 text-xs mb-4 pb-3 border-b">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-purple-500 inline-block" /> Review
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Unvisited
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-96">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isReview = Boolean(markedForReview[q.id]);
              const isCurrent = idx === currentIndex;

              let badgeStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
              if (isReview) badgeStyle = 'bg-purple-600 text-white';
              else if (isAnswered) badgeStyle = 'bg-emerald-600 text-white';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg font-semibold text-xs transition ${badgeStyle} ${
                    isCurrent ? 'ring-2 ring-offset-1 ring-indigo-600' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
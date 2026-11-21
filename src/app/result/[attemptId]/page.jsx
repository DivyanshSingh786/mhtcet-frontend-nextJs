'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Award, CheckCircle, XCircle, Target, ArrowLeft } from 'lucide-react';

function ResultContent() {
  const { attemptId } = useParams();
  const router = useRouter();
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const res = await api.post(`/evaluations/${attemptId}`);
        setScorecard(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to evaluate attempt.');
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) fetchScorecard();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        Calculating MHT-CET Scorecard...
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-red-400 gap-4">
        <p>{error}</p>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-indigo-400 underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Official Mock Scorecard • {scorecard.stream} Stream
            </span>
            <h1 className="text-2xl font-bold mt-1">Performance Summary</h1>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* Primary Score Highlight */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center mb-6">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Total MHT-CET Score</p>
          <div className="text-5xl font-extrabold text-white">
            {scorecard.totalScore}{' '}
            <span className="text-xl font-normal text-slate-500">/ {scorecard.maxPossibleScore}</span>
          </div>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-emerald-400">{scorecard.correctCount}</p>
            <p className="text-xs text-slate-400">Correct</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
            <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-400">{scorecard.incorrectCount}</p>
            <p className="text-xs text-slate-400">Incorrect (0 Neg)</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
            <Target className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-indigo-400">{scorecard.accuracyPercentage}%</p>
            <p className="text-xs text-slate-400">Accuracy</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Take Another MHT-CET Mock Test
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
          Loading Scorecard...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
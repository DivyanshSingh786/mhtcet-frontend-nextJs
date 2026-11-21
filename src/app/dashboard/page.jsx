'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Calculator,
  Dna,
  Play,
  ShieldAlert,
  LogOut,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [stream, setStream] = useState('PCM');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('mhtcet_token');
    const savedUser = localStorage.getItem('mhtcet_userId');
    const savedRole = localStorage.getItem('mhtcet_role') || 'STUDENT';

    if (!token || !savedUser) {
      router.push('/login');
      return;
    }
    setUserId(savedUser);
    setRole(savedRole);
  }, [router]);

  const handleStartExam = async () => {
    setStarting(true);
    try {
      const res = await api.post('/attempts/start', null, {
        params: { userId, stream },
      });
      const sectionData = res.data;

      sessionStorage.setItem(`exam_${sectionData.attemptId}`, JSON.stringify(sectionData));
      router.push(`/exam/${sectionData.attemptId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start exam. Ensure Question Bank has questions.');
      setStarting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const isAdmin = role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-indigo-400">MHT-CET CBT Dashboard</span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isAdmin
                ? 'bg-amber-950/70 text-amber-300 border-amber-700'
                : 'bg-indigo-950/70 text-indigo-300 border-indigo-800'
            }`}
          >
            {role}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => router.push('/admin/questions')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition"
            >
              <PlusCircle className="w-4 h-4" /> Add MCQs
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Admin-Only Management Panel */}
        {isAdmin && (
          <section className="mb-10 bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-800/70 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-200">Admin Question Bank Studio</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Create Physics, Chemistry, Mathematics (+2), and Biology MCQs for Std XI & Std XII mock papers.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/admin/questions')}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
            >
              <PlusCircle className="w-4 h-4" /> Open Question Editor
            </button>
          </section>
        )}

        <h1 className="text-3xl font-bold mb-2">
          {isAdmin ? 'Preview MHT-CET Mock Exam' : 'Choose Your MHT-CET Stream'}
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Full-length 180-minute mock exam following State CET Cell sectional lock rules.
        </p>

        {/* Stream Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => setStream('PCM')}
            className={`p-6 rounded-2xl border-2 text-left transition ${
              stream === 'PCM'
                ? 'border-indigo-500 bg-indigo-950/30'
                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Calculator className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                150 Qs • 200 Marks
              </span>
            </div>
            <h2 className="text-xl font-bold mb-1">PCM Group (Engineering)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Section 1 (90m): Physics (50) + Chemistry (50) @ +1 mark each.
              <br />
              Section 2 (90m): Mathematics (50) @ +2 marks each.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStream('PCB')}
            className={`p-6 rounded-2xl border-2 text-left transition ${
              stream === 'PCB'
                ? 'border-emerald-500 bg-emerald-950/30'
                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
                <Dna className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                200 Qs • 200 Marks
              </span>
            </div>
            <h2 className="text-xl font-bold mb-1">PCB Group (Pharmacy / Agri)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Section 1 (90m): Physics (50) + Chemistry (50) @ +1 mark each.
              <br />
              Section 2 (90m): Biology (100) @ +1 mark each.
            </p>
          </button>
        </div>

        {/* Exam Rules Banner */}
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 mb-8 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 space-y-1">
            <p className="font-semibold text-amber-300">Important Sectional Lock Rule:</p>
            <p>
              Section 2 ({stream === 'PCM' ? 'Mathematics' : 'Biology'}) remains locked during the first 90 minutes.
              Once you finish Section 1, you cannot return to Physics or Chemistry.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartExam}
          disabled={starting}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm transition disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          {starting ? 'Generating Randomized Paper...' : `Start ${stream} Mock Test Now`}
        </button>
      </main>
    </div>
  );
}
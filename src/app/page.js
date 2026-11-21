'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Clock,
  Lock,
  CheckCircle2,
  Calculator,
  Dna,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('mhtcet_token');
    setIsLoggedIn(Boolean(token));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              MHT-CET <span className="text-indigo-400">CBT Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm flex items-center gap-1.5 transition"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm transition"
                >
                  Start Free Mock
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-800/70 text-indigo-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Authentic State CET Cell CBT Exam Simulator • PCM & PCB
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
            Practice MHT-CET Under Real{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              90-Minute Sectional Locks
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
            Simulate the exact 180-minute Computer-Based Test environment with 20% Std XI and 80% Std XII
            Maharashtra State Board weightage, differential marking, and instant scorecards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isLoggedIn ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition"
            >
              {isLoggedIn ? 'Launch Mock Test' : 'Register & Start Mock Test'}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/questions"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-sm text-slate-300 transition"
            >
              Question Bank Studio
            </Link>
          </div>
        </section>

        {/* Exam Pattern Comparison Cards */}
        <section className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">PCM Stream (Engineering)</h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300">
                150 Qs • 200 Marks
              </span>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Section 1 (90 mins):</strong> 50 Physics + 50 Chemistry (+1 mark each)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Section 2 (90 mins):</strong> 50 Mathematics (+2 marks each)
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <Dna className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">PCB Stream (Pharmacy / Agri)</h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300">
                200 Qs • 200 Marks
              </span>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Section 1 (90 mins):</strong> 50 Physics + 50 Chemistry (+1 mark each)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Section 2 (90 mins):</strong> 100 Biology (+1 mark each)
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Core Engine Highlights */}
        <section className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5">
            <Lock className="w-5 h-5 text-amber-400 mb-2.5" />
            <h3 className="font-bold text-sm mb-1">Strict Sectional Lock</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Section 2 stays locked until Section 1 finishes—preventing premature switching just like the real CET exam.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5">
            <Clock className="w-5 h-5 text-indigo-400 mb-2.5" />
            <h3 className="font-bold text-sm mb-1">Server-Synced Countdown</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every response auto-saves to the Test Engine microservice while enforcing the 90-minute timer per section.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2.5" />
            <h3 className="font-bold text-sm mb-1">Zero Negative Marking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant evaluation out of 200 marks with accuracy metrics and zero penalty for incorrect guesses.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        MHT-CET Microservices Mock Test Platform • Spring Boot + Spring Cloud + Next.js
      </footer>
    </div>
  );
}
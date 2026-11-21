"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { PlusCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AdminQuestionsPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("PHYSICS");
  const [standard, setStandard] = useState("XII");
  const [chapter, setChapter] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctOptionId, setCorrectOptionId] = useState("A");
  const [explanation, setExplanation] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mhtcet_token");
    const role = localStorage.getItem("mhtcet_role");
    if (!token) {
      router.push("/login");
    } else if (role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    const payload = {
      subject,
      standard,
      chapter,
      questionText,
      options: [
        { optionId: "A", text: options.A },
        { optionId: "B", text: options.B },
        { optionId: "C", text: options.C },
        { optionId: "D", text: options.D },
      ],
      correctOptionId,
      marks: subject === "MATHEMATICS" ? 2 : 1,
      explanation,
    };

    try {
      const res = await api.post("/questions", payload);
      setSuccessMsg(
        `Question #${res.data.id} saved (${subject} • +${payload.marks} Marks)!`,
      );
      setChapter("");
      setQuestionText("");
      setOptions({ A: "", B: "", C: "", D: "" });
      setExplanation("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save question.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-600">
          Loading Scorecard...
        </div>
      }
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Add MHT-CET Question</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Mathematics automatically assigns +2 marks; Physics, Chemistry
                  & Biology assign +1 mark.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                +{subject === "MATHEMATICS" ? 2 : 1}{" "}
                {subject === "MATHEMATICS" ? "Marks" : "Mark"}
              </span>
            </div>

            {successMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-5">
              {/* Subject, Standard & Chapter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  >
                    <option value="PHYSICS">Physics (+1)</option>
                    <option value="CHEMISTRY">Chemistry (+1)</option>
                    <option value="MATHEMATICS">Mathematics (+2)</option>
                    <option value="BIOLOGY">Biology (+1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Syllabus Standard
                  </label>
                  <select
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  >
                    <option value="XII">Std XII (80% Weightage)</option>
                    <option value="XI">Std XI (20% Weightage)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Chapter Name
                  </label>
                  <input
                    type="text"
                    required
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g., Electrostatics"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Question Statement
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the MCQ problem statement..."
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((optKey) => (
                  <div key={optKey}>
                    <label className="block text-xs text-slate-400 mb-1">
                      Option {optKey}
                    </label>
                    <input
                      type="text"
                      required
                      value={options[optKey]}
                      onChange={(e) =>
                        handleOptionChange(optKey, e.target.value)
                      }
                      placeholder={`Enter Option ${optKey}`}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer & Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Correct Option
                  </label>
                  <select
                    value={correctOptionId}
                    onChange={(e) => setCorrectOptionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">
                    Solution Explanation
                  </label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Step-by-step formula or reasoning..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                {saving ? "Saving Question..." : "Save Question to Bank"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

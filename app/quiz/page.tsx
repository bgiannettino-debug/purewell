"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const goals = [
  { id: "sleep", label: "Better sleep" },
  { id: "stress", label: "Stress & anxiety relief" },
  { id: "energy", label: "Energy & focus" },
  { id: "immune", label: "Immune support" },
  { id: "gut", label: "Gut & digestion" },
  { id: "skin", label: "Skin & hair health" },
  { id: "joints", label: "Joint & muscle support" },
  { id: "hormones", label: "Hormonal balance" },
];

const diets = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "keto", label: "Keto / low-carb" },
  { id: "none", label: "No restrictions" },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    goals: [] as string[],
    stressLevel: 3,
    diet: [] as string[],
    format: "",
    budget: "",
    duration: "",
  });

  const toggleGoal = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));
  };

  const toggleDiet = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      diet: prev.diet.includes(id)
        ? prev.diet.filter((d) => d !== id)
        : [...prev.diet, id],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      localStorage.setItem("purewell-protocol", JSON.stringify(data.protocol));
      router.push("/quiz/results");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // Step 0 — Welcome
    <div key="welcome" className="text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-medium text-gray-900 mb-3">
        Build your wellness plan
      </h1>
      <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Answer 5 quick questions and our AI will create a personalized natural
        health protocol matched to your goals.
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
        {["100% natural", "AI-powered", "Free to start"].map((f) => (
          <div key={f} className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-xs font-medium text-emerald-800">{f}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setStep(1)}
        className="bg-emerald-600 text-white font-medium px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
      >
        Start the quiz →
      </button>
    </div>,

    // Step 1 — Goals
    <div key="goals">
      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
        Question 1 of 5
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">
        What are your top health goals?
      </h2>
      <p className="text-sm text-gray-500 mb-6">Choose all that apply.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left ${
              answers.goals.includes(goal.id)
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-white border-gray-200 text-gray-700 hover:border-emerald-200"
            }`}
          >
            {goal.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(2)}
        disabled={answers.goals.length === 0}
        className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>,

    // Step 2 — Stress
    <div key="stress">
      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
        Question 2 of 5
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">
        How would you rate your current stress level?
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        1 = very low · 5 = very high
      </p>
      <div className="flex gap-3 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() =>
              setAnswers((prev) => ({ ...prev, stressLevel: n }))
            }
            className={`flex-1 py-4 rounded-xl text-lg font-medium border transition-all ${
              answers.stressLevel === n
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-white border-gray-200 text-gray-600 hover:border-emerald-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-8">
        <span>Very low</span>
        <span>Very high</span>
      </div>
      <button
        onClick={() => setStep(3)}
        className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors"
      >
        Continue →
      </button>
    </div>,

    // Step 3 — Diet
    <div key="diet">
      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
        Question 3 of 5
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">
        Any dietary preferences or restrictions?
      </h2>
      <p className="text-sm text-gray-500 mb-6">Choose all that apply.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {diets.map((diet) => (
          <button
            key={diet.id}
            onClick={() => toggleDiet(diet.id)}
            className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left ${
              answers.diet.includes(diet.id)
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-white border-gray-200 text-gray-700 hover:border-emerald-200"
            }`}
          >
            {diet.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(4)}
        disabled={answers.diet.length === 0}
        className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>,

    // Step 4 — Format & Budget
    <div key="format">
      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
        Question 4 of 5
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">
        How do you prefer your wellness routine?
      </h2>
      <p className="text-sm text-gray-500 mb-6">Pick one.</p>
      <div className="flex flex-col gap-3 mb-6">
        {[
          { id: "diy", label: "DIY — I love making things at home", desc: "Teas, lattes, homemade remedies" },
          { id: "supplements", label: "Supplements — quick and easy", desc: "Just take a capsule with water" },
          { id: "mixed", label: "Mix of both", desc: "Some DIY rituals plus key supplements" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setAnswers((prev) => ({ ...prev, format: opt.id }))}
            className={`px-4 py-3 rounded-xl text-sm border transition-all text-left ${
              answers.format === opt.id
                ? "bg-emerald-50 border-emerald-400"
                : "bg-white border-gray-200 hover:border-emerald-200"
            }`}
          >
            <div className="font-medium text-gray-900">{opt.label}</div>
            <div className="text-gray-500 text-xs mt-0.5">{opt.desc}</div>
          </button>
        ))}
      </div>
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Monthly wellness budget?
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { id: "under-25", label: "Under $25" },
          { id: "25-60", label: "$25 – $60" },
          { id: "60-100", label: "$60 – $100" },
          { id: "100+", label: "$100+" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setAnswers((prev) => ({ ...prev, budget: opt.id }))}
            className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
              answers.budget === opt.id
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-white border-gray-200 text-gray-700 hover:border-emerald-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(5)}
        disabled={!answers.format || !answers.budget}
        className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>,

    // Step 5 — Duration
    <div key="duration">
      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
        Question 5 of 5
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">
        How long have you been dealing with these concerns?
      </h2>
      <p className="text-sm text-gray-500 mb-6">This helps set realistic expectations.</p>
      <div className="flex flex-col gap-3 mb-8">
        {[
          { id: "just-starting", label: "Just starting to notice issues" },
          { id: "few-months", label: "A few months" },
          { id: "over-a-year", label: "Over a year" },
          { id: "comes-and-goes", label: "It comes and goes" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() =>
              setAnswers((prev) => ({ ...prev, duration: opt.id }))
            }
            className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left ${
              answers.duration === opt.id
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-white border-gray-200 text-gray-700 hover:border-emerald-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!answers.duration || loading}
        className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Building your plan..." : "Build my wellness plan →"}
      </button>
    </div>,
  ];

  const progress = (step / 5) * 100;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
        </Link>
        <div className="flex-1" />
        {step > 0 && (
          <div className="text-sm text-gray-400">
            Step {step} of 5
          </div>
        )}
      </nav>

      {step > 0 && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="max-w-lg mx-auto px-5 py-12">
        {steps[step]}

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 w-full text-center"
          >
            ← Back
          </button>
        )}
      </div>
    </main>
  );
}
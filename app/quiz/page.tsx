"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const goals = [
  { id: "sleep", label: "Better sleep", desc: "Fall asleep faster, sleep deeper" },
  { id: "stress", label: "Stress & anxiety relief", desc: "Feel calmer, more resilient" },
  { id: "energy", label: "Energy & focus", desc: "Sustained energy without crashes" },
  { id: "immune", label: "Immune support", desc: "Stay healthy year-round" },
  { id: "gut", label: "Gut & digestion", desc: "Bloating, regularity, microbiome" },
  { id: "skin", label: "Skin & hair health", desc: "Glow from the inside out" },
  { id: "joints", label: "Joint & muscle support", desc: "Mobility, recovery, inflammation" },
  { id: "hormones", label: "Hormonal balance", desc: "Cycle, mood, thyroid support" },
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

  const progress = step === 0 ? 0 : Math.round((step / 5) * 100);

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#3d6b4f", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24" }}>
            pure<span style={{ color: "#3d6b4f" }}>well</span>
          </span>
        </Link>
        {step > 0 && (
          <span style={{ fontSize: "12px", color: "#9c9488" }}>Step {step} of 5</span>
        )}
      </div>

      {/* Progress bar */}
      {step > 0 && (
        <div style={{ height: "3px", background: "#e7e3dc" }}>
          <div style={{ height: "100%", background: "#3d6b4f", width: `${progress}%`, transition: "width 0.3s" }} />
        </div>
      )}

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <span style={{ fontSize: "28px" }}>🌿</span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#2d2a24", marginBottom: "10px" }}>
              Build your wellness plan
            </h1>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "28px", maxWidth: "400px", margin: "0 auto 28px" }}>
              Answer 5 quick questions and our AI will create a personalized natural health protocol matched to your specific goals.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", maxWidth: "380px", margin: "0 auto 28px" }}>
              {[["🌿", "100% natural"], ["⭐", "AI-powered"], ["✓", "Free to start"]].map(([icon, label]) => (
                <div key={label} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{icon}</div>
                  <div style={{ fontSize: "11px", fontWeight: "500", color: "#6b6560" }}>{label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              style={{ background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px 32px", borderRadius: "12px", border: "none", cursor: "pointer" }}
            >
              Start the quiz →
            </button>
            <div style={{ fontSize: "12px", color: "#9c9488", marginTop: "12px" }}>
              Takes about 2 minutes · no account required
            </div>
          </div>
        )}

        {/* Step 1 — Goals */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              Question 1 of 5
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "6px" }}>
              What are your top health goals?
            </h2>
            <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "20px" }}>
              Choose all that apply.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {goals.map((goal) => {
                const selected = answers.goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{ padding: "12px 14px", borderRadius: "12px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#fff", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: selected ? "#3d6b4f" : "#2d2a24", marginBottom: "2px" }}>
                      {goal.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9c9488" }}>{goal.desc}</div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={answers.goals.length === 0}
              style={{ width: "100%", background: answers.goals.length > 0 ? "#3d6b4f" : "#c5bfb5", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: answers.goals.length > 0 ? "pointer" : "not-allowed" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Stress */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              Question 2 of 5
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "6px" }}>
              How would you rate your current stress level?
            </h2>
            <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "20px" }}>
              1 = very low · 5 = very high
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = answers.stressLevel === n;
                return (
                  <button
                    key={n}
                    onClick={() => setAnswers((prev) => ({ ...prev, stressLevel: n }))}
                    style={{ flex: 1, padding: "14px", borderRadius: "12px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#fff", fontSize: "16px", fontWeight: "700", color: selected ? "#3d6b4f" : "#6b6560", cursor: "pointer" }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9c9488", marginBottom: "24px" }}>
              <span>Very low</span><span>Very high</span>
            </div>
            <button
              onClick={() => setStep(3)}
              style={{ width: "100%", background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 3 — Diet */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              Question 3 of 5
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "6px" }}>
              Any dietary preferences or restrictions?
            </h2>
            <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "20px" }}>
              Choose all that apply.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {diets.map((diet) => {
                const selected = answers.diet.includes(diet.id);
                return (
                  <button
                    key={diet.id}
                    onClick={() => toggleDiet(diet.id)}
                    style={{ padding: "12px 14px", borderRadius: "12px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#fff", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: "600", color: selected ? "#3d6b4f" : "#2d2a24" }}
                  >
                    {diet.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(4)}
              disabled={answers.diet.length === 0}
              style={{ width: "100%", background: answers.diet.length > 0 ? "#3d6b4f" : "#c5bfb5", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: answers.diet.length > 0 ? "pointer" : "not-allowed" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 4 — Format & Budget */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              Question 4 of 5
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "6px" }}>
              How do you prefer your wellness routine?
            </h2>
            <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "16px" }}>Pick one.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {[
                { id: "diy", label: "DIY — I love making things at home", desc: "Teas, lattes, homemade remedies" },
                { id: "supplements", label: "Supplements — quick and easy", desc: "Just take a capsule with water" },
                { id: "mixed", label: "Mix of both", desc: "Some DIY rituals plus key supplements" },
              ].map((opt) => {
                const selected = answers.format === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, format: opt.id }))}
                    style={{ padding: "12px 14px", borderRadius: "12px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#fff", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: selected ? "#3d6b4f" : "#2d2a24", marginBottom: "2px" }}>{opt.label}</div>
                    <div style={{ fontSize: "11px", color: "#9c9488" }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", marginBottom: "12px" }}>
              Monthly wellness budget?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
              {[
                { id: "under-25", label: "Under $25" },
                { id: "25-60", label: "$25 – $60" },
                { id: "60-100", label: "$60 – $100" },
                { id: "100+", label: "$100+" },
              ].map((opt) => {
                const selected = answers.budget === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, budget: opt.id }))}
                    style={{ padding: "12px", borderRadius: "12px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: selected ? "#3d6b4f" : "#2d2a24" }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(5)}
              disabled={!answers.format || !answers.budget}
              style={{ width: "100%", background: answers.format && answers.budget ? "#3d6b4f" : "#c5bfb5", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: answers.format && answers.budget ? "pointer" : "not-allowed" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 5 — Duration */}
        {step === 5 && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              Question 5 of 5
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "6px" }}>
              How long have you been dealing with these concerns?
            </h2>
            <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "20px" }}>
              This helps us set realistic expectations.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {[
                { id: "just-starting", label: "Just starting to notice issues" },
                { id: "few-months", label: "A few months" },
                { id: "over-a-year", label: "Over a year" },
                { id: "comes-and-goes", label: "It comes and goes" },
              ].map((opt) => {
                const selected = answers.duration === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, duration: opt.id }))}
                    style={{ padding: "13px 14px", borderRadius: "12px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#fff", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: "600", color: selected ? "#3d6b4f" : "#2d2a24" }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!answers.duration || loading}
              style={{ width: "100%", background: answers.duration && !loading ? "#3d6b4f" : "#c5bfb5", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: answers.duration && !loading ? "pointer" : "not-allowed" }}
            >
              {loading ? "Building your plan..." : "Build my wellness plan →"}
            </button>
          </div>
        )}

        {/* Back button */}
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{ marginTop: "16px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#9c9488", width: "100%", textAlign: "center" }}
          >
            ← Back
          </button>
        )}
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

// Shared style objects for the warm earthy palette
const s = {
  optionBase: {
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 500 as const,
    background: "#fff",
    border: "1px solid #e7e3dc",
    color: "#2d2a24",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.15s ease",
  },
  optionSelected: {
    background: "#eef5f0",
    borderColor: "#c8ddd0",
    color: "#3d6b4f",
  },
  primaryCta: {
    width: "100%",
    background: "#3d6b4f",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600 as const,
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.15s ease",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600 as const,
    color: "#3d6b4f",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: "8px",
  },
  h2: {
    fontSize: "22px",
    fontWeight: 600 as const,
    color: "#2d2a24",
    marginBottom: "6px",
    lineHeight: 1.3,
  },
  helper: {
    fontSize: "13px",
    color: "#6b6560",
    marginBottom: "24px",
  },
};

const optionStyle = (selected: boolean) =>
  selected ? { ...s.optionBase, ...s.optionSelected } : s.optionBase;

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

  const hasAnswers =
    answers.goals.length > 0 ||
    answers.diet.length > 0 ||
    answers.format !== "" ||
    answers.budget !== "" ||
    answers.duration !== "";

  const handleExit = () => {
    if (hasAnswers) {
      const ok = window.confirm(
        "Leave the quiz? Your answers so far will be lost."
      );
      if (!ok) return;
    }
    router.push("/");
  };

  const steps = [
    // Step 0 — Welcome
    <div key="welcome" style={{ textAlign: "center" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "#eef5f0",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3d6b4f"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#2d2a24",
          marginBottom: "12px",
          lineHeight: 1.25,
        }}
      >
        Build your wellness plan
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#6b6560",
          marginBottom: "28px",
          maxWidth: "380px",
          margin: "0 auto 28px",
          lineHeight: 1.6,
        }}
      >
        Answer 5 quick questions and our AI will create a personalized natural
        health protocol matched to your goals.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          maxWidth: "380px",
          margin: "0 auto 28px",
        }}
      >
        {["100% natural", "AI-powered", "Free to start"].map((f) => (
          <div
            key={f}
            style={{
              background: "#eef5f0",
              border: "1px solid #c8ddd0",
              borderRadius: "12px",
              padding: "10px 8px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#3d6b4f",
            }}
          >
            {f}
          </div>
        ))}
      </div>
      <button
        onClick={() => setStep(1)}
        style={{
          background: "#3d6b4f",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          padding: "13px 32px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Start the quiz →
      </button>
    </div>,

    // Step 1 — Goals
    <div key="goals">
      <div style={s.sectionLabel}>Question 1 of 5</div>
      <h2 style={s.h2}>What are your top health goals?</h2>
      <p style={s.helper}>Choose all that apply.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            style={optionStyle(answers.goals.includes(goal.id))}
          >
            {goal.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(2)}
        disabled={answers.goals.length === 0}
        style={{
          ...s.primaryCta,
          opacity: answers.goals.length === 0 ? 0.4 : 1,
          cursor: answers.goals.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        Continue →
      </button>
    </div>,

    // Step 2 — Stress
    <div key="stress">
      <div style={s.sectionLabel}>Question 2 of 5</div>
      <h2 style={s.h2}>How would you rate your current stress level?</h2>
      <p style={s.helper}>1 = very low · 5 = very high</p>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() =>
              setAnswers((prev) => ({ ...prev, stressLevel: n }))
            }
            style={{
              ...optionStyle(answers.stressLevel === n),
              flex: 1,
              padding: "16px 0",
              fontSize: "18px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#9c9488",
          marginBottom: "28px",
        }}
      >
        <span>Very low</span>
        <span>Very high</span>
      </div>
      <button onClick={() => setStep(3)} style={s.primaryCta}>
        Continue →
      </button>
    </div>,

    // Step 3 — Diet
    <div key="diet">
      <div style={s.sectionLabel}>Question 3 of 5</div>
      <h2 style={s.h2}>Any dietary preferences or restrictions?</h2>
      <p style={s.helper}>Choose all that apply.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {diets.map((diet) => (
          <button
            key={diet.id}
            onClick={() => toggleDiet(diet.id)}
            style={optionStyle(answers.diet.includes(diet.id))}
          >
            {diet.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(4)}
        disabled={answers.diet.length === 0}
        style={{
          ...s.primaryCta,
          opacity: answers.diet.length === 0 ? 0.4 : 1,
          cursor: answers.diet.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        Continue →
      </button>
    </div>,

    // Step 4 — Format & Budget
    <div key="format">
      <div style={s.sectionLabel}>Question 4 of 5</div>
      <h2 style={s.h2}>How do you prefer your wellness routine?</h2>
      <p style={s.helper}>Pick one.</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            id: "diy",
            label: "DIY — I love making things at home",
            desc: "Teas, lattes, homemade remedies",
          },
          {
            id: "supplements",
            label: "Supplements — quick and easy",
            desc: "Just take a capsule with water",
          },
          {
            id: "mixed",
            label: "Mix of both",
            desc: "Some DIY rituals plus key supplements",
          },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() =>
              setAnswers((prev) => ({ ...prev, format: opt.id }))
            }
            style={optionStyle(answers.format === opt.id)}
          >
            <div style={{ fontWeight: 600, color: "#2d2a24" }}>{opt.label}</div>
            <div
              style={{
                color: "#6b6560",
                fontSize: "12px",
                marginTop: "2px",
                fontWeight: 400,
              }}
            >
              {opt.desc}
            </div>
          </button>
        ))}
      </div>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#2d2a24",
          marginBottom: "12px",
        }}
      >
        Monthly wellness budget?
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[
          { id: "under-25", label: "Under $25" },
          { id: "25-60", label: "$25 – $60" },
          { id: "60-100", label: "$60 – $100" },
          { id: "100+", label: "$100+" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() =>
              setAnswers((prev) => ({ ...prev, budget: opt.id }))
            }
            style={optionStyle(answers.budget === opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(5)}
        disabled={!answers.format || !answers.budget}
        style={{
          ...s.primaryCta,
          opacity: !answers.format || !answers.budget ? 0.4 : 1,
          cursor:
            !answers.format || !answers.budget ? "not-allowed" : "pointer",
        }}
      >
        Continue →
      </button>
    </div>,

    // Step 5 — Duration
    <div key="duration">
      <div style={s.sectionLabel}>Question 5 of 5</div>
      <h2 style={s.h2}>How long have you been dealing with these concerns?</h2>
      <p style={s.helper}>This helps set realistic expectations.</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
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
            style={optionStyle(answers.duration === opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!answers.duration || loading}
        style={{
          ...s.primaryCta,
          opacity: !answers.duration || loading ? 0.6 : 1,
          cursor: !answers.duration || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Building your plan..." : "Build my wellness plan →"}
      </button>
    </div>,
  ];

  const progress = (step / 5) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#faf8f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      {step > 0 && (
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e7e3dc",
          }}
        >
          <div
            style={{
              maxWidth: "640px",
              margin: "0 auto",
              padding: "14px 24px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#3d6b4f",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Step {step} of 5
            </span>
            <button
              onClick={handleExit}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                color: "#9c9488",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px",
              }}
            >
              ✕ Exit quiz
            </button>
          </div>
          <div
            style={{
              maxWidth: "640px",
              margin: "10px auto 0",
              padding: "0 24px 14px",
            }}
          >
            <div
              style={{
                height: "4px",
                background: "#e7e3dc",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#3d6b4f",
                  borderRadius: "99px",
                  width: `${progress}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          maxWidth: "640px",
          margin: "0 auto",
          padding: "40px 24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {steps[step]}

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              marginTop: "16px",
              fontSize: "13px",
              color: "#6b6560",
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "center",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            ← Back
          </button>
        )}
      </div>

      <Footer />
    </main>
  );
}

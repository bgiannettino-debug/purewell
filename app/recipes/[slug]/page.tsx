import Link from "next/link";
import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";

export const dynamic = "force-dynamic";

type Step = {
  step: number;
  title: string;
  instruction: string;
};

type Ingredient = {
  amount: string;
  name: string;
};

const goalColors: Record<string, { bg: string; color: string }> = {
  sleep:   { bg: "#f0eef8", color: "#6b5fa8" },
  stress:  { bg: "#eef3f8", color: "#4a6fa8" },
  immune:  { bg: "#eef5f0", color: "#3d6b4f" },
  energy:  { bg: "#fef6e7", color: "#8a6020" },
  gut:     { bg: "#fef2ec", color: "#8a4a20" },
  joints:  { bg: "#fef0ee", color: "#8a3020" },
  hormones:{ bg: "#fdf0f5", color: "#8a3060" },
  skin:    { bg: "#fdf2f5", color: "#8a3050" },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;

  const recipe = await db.recipe.findUnique({
    where: { slug },
  });

  if (!recipe) notFound();

  const goals = recipe.goals as string[];
  const steps = recipe.steps as Step[];
  const ingredients = recipe.ingredients as Ingredient[];

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Back link */}
        <Link
          href="/recipes"
          style={{ fontSize: "13px", color: "#6b6560", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "20px" }}
        >
          ← All recipes
        </Link>

        {/* Goal tags */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
          {goals.map((goal) => {
            const colors = goalColors[goal] || { bg: "#f0f0f0", color: "#666" };
            return (
              <span
                key={goal}
                style={{ fontSize: "11px", background: colors.bg, color: colors.color, padding: "4px 10px", borderRadius: "99px", fontWeight: "500", textTransform: "capitalize" }}
              >
                {goal}
              </span>
            );
          })}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#2d2a24", marginBottom: "10px", textTransform: "capitalize" }}>
          {recipe.name}
        </h1>
        <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "24px" }}>
          {recipe.description}
        </p>

        {/* Meta cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "28px" }}>
          {[
            { value: `${recipe.prepTime} min`, label: "Prep time" },
            { value: `$${recipe.costPerServing.toFixed(2)}`, label: "Per serving" },
            { value: `${recipe.servings}`, label: recipe.servings > 1 ? "Servings" : "Serving" },
            { value: recipe.difficulty, label: "Difficulty" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#2d2a24" }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: "#9c9488", marginTop: "2px" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "16px" }}>
            Ingredients
          </h2>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {ingredients.map((ing, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3d6b4f", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#3d6b4f", minWidth: "64px" }}>
                  {ing.amount}
                </span>
                <span style={{ fontSize: "13px", color: "#2d2a24" }}>{ing.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "16px" }}>
            Instructions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {steps.map((step) => (
              <div key={step.step} style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#eef5f0", border: "1px solid #c8ddd0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "#3d6b4f", flexShrink: 0, marginTop: "2px" }}>
                  {step.step}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "4px" }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b6560", lineHeight: 1.6 }}>
                    {step.instruction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shop CTA */}
        <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d2a24", marginBottom: "4px" }}>
            Shop the ingredients
          </div>
          <p style={{ fontSize: "13px", color: "#6b6560", marginBottom: "12px" }}>
            Find natural products used in this recipe in our store.
          </p>
          <Link
            href="/"
            style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", display: "inline-block" }}
          >
            Browse products →
          </Link>
        </div>

        {/* Disclaimer */}
        <div style={{ fontSize: "11px", color: "#9c9488", textAlign: "center", lineHeight: 1.6 }}>
          These recipes are for general wellness purposes only and have not been evaluated by the FDA.
          Consult your healthcare provider before use if pregnant, nursing, or on medications.
        </div>
      </div>
    </main>
  );
}
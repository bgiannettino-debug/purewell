import Link from "next/link";
import { db } from "../../lib/db";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DIY Wellness Recipes",
  description: "Free homemade wellness recipes using natural ingredients. Elderberry syrup, golden milk, sleep lattes, and more. Make natural remedies at home.",
};

export const dynamic = "force-dynamic";

const goalColors: Record<string, { bg: string; color: string }> = {
  sleep:    { bg: "#f0eef8", color: "#6b5fa8" },
  stress:   { bg: "#eef3f8", color: "#4a6fa8" },
  immune:   { bg: "#eef5f0", color: "#3d6b4f" },
  energy:   { bg: "#fef6e7", color: "#8a6020" },
  gut:      { bg: "#fef2ec", color: "#8a4a20" },
  joints:   { bg: "#fef0ee", color: "#8a3020" },
  hormones: { bg: "#fdf0f5", color: "#8a3060" },
  skin:     { bg: "#fdf2f5", color: "#8a3050" },
};

export default async function RecipesPage() {
  const recipes = await db.recipe.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "99px", marginBottom: "12px" }}>
            🌿 DIY wellness recipes
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2d2a24", marginBottom: "8px" }}>
            Make it at home
          </h1>
          <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.7", maxWidth: "480px" }}>
            Free homemade wellness recipes using natural ingredients. Each recipe links to the products you need — or use what you already have.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div className="recipe-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {recipes.map((recipe) => {
            const goals = recipe.goals as string[];
            return (
              <Link href={`/recipes/${recipe.slug}`} key={recipe.id} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {goals.map((goal) => {
                        const colors = goalColors[goal] || { bg: "#f0f0f0", color: "#666" };
                        return (
                          <span key={goal} style={{ fontSize: "11px", background: colors.bg, color: colors.color, padding: "3px 9px", borderRadius: "99px", fontWeight: "500", textTransform: "capitalize" }}>
                            {goal}
                          </span>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: "11px", color: "#9c9488", whiteSpace: "nowrap", marginLeft: "8px" }}>
                      {recipe.prepTime} min
                    </span>
                  </div>
                  <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "6px", textTransform: "capitalize" }}>
                    {recipe.name}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#6b6560", lineHeight: "1.6", marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {recipe.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <span style={{ fontSize: "11px", color: "#9c9488" }}>{recipe.servings} serving{recipe.servings > 1 ? "s" : ""}</span>
                      <span style={{ fontSize: "11px", color: "#9c9488" }}>~${recipe.costPerServing.toFixed(2)}/serving</span>
                      <span style={{ fontSize: "11px", color: "#9c9488" }}>{recipe.difficulty}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f" }}>Free →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
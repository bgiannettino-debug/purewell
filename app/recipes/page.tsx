import Link from "next/link";
import { db } from "../../lib/db";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipesTabs from "../components/RecipesTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DIY Wellness Recipes + AI Generator",
  description: "Free homemade wellness recipes using natural ingredients. Browse our curated recipes or use our AI generator to create a custom DIY recipe from ingredients you already have.",
};

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await db.recipe.findMany({
    orderBy: { createdAt: "asc" },
  });

  const recipeCards = recipes.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    goals: r.goals as string[],
    prepTime: r.prepTime,
    servings: r.servings,
    costPerServing: r.costPerServing,
    difficulty: r.difficulty,
  }));

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#faf8f5", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#6b6560", textDecoration: "none", marginBottom: "20px" }}
          >
            ← Back to products
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "99px", marginBottom: "12px", marginLeft: "12px" }}>
            🌿 DIY wellness recipes
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2d2a24", marginBottom: "8px" }}>
            Make it at home
          </h1>
          <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.7", maxWidth: "520px" }}>
            Free homemade wellness recipes using natural ingredients. Browse our curated collection — or use the AI generator to design a custom recipe from ingredients you already have.
          </p>
        </div>
      </div>

      <RecipesTabs recipes={recipeCards} />

      <Footer />
    </main>
  );
}
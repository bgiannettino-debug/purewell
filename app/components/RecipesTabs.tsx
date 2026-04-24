"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeGenerator from "./RecipeGenerator";

type RecipeCard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  goals: string[];
  prepTime: number;
  servings: number;
  costPerServing: number;
  difficulty: string;
};

const goalColors: Record<string, { bg: string; color: string }> = {
  sleep: { bg: "#f0eef8", color: "#6b5fa8" },
  stress: { bg: "#eef3f8", color: "#4a6fa8" },
  immune: { bg: "#eef5f0", color: "#3d6b4f" },
  energy: { bg: "#fef6e7", color: "#8a6020" },
  gut: { bg: "#fef2ec", color: "#8a4a20" },
  joints: { bg: "#fef0ee", color: "#8a3020" },
  hormones: { bg: "#fdf0f5", color: "#8a3060" },
  skin: { bg: "#fdf2f5", color: "#8a3050" },
};

type Tab = "browse" | "generate";

export default function RecipesTabs({ recipes }: { recipes: RecipeCard[] }) {
  const [tab, setTab] = useState<Tab>("browse");

  const tabButton = (id: Tab, label: string, emoji: string) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: "600",
          padding: "10px 18px",
          borderRadius: "10px",
          border: active ? "1px solid #c8ddd0" : "1px solid transparent",
          background: active ? "#eef5f0" : "transparent",
          color: active ? "#3d6b4f" : "#6b6560",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <span>{emoji}</span>
        {label}
      </button>
    );
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 24px 48px 24px" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "6px",
          background: "#fff",
          border: "1px solid #e7e3dc",
          borderRadius: "12px",
          marginBottom: "24px",
          width: "fit-content",
        }}
      >
        {tabButton("browse", "Browse recipes", "📖")}
        {tabButton("generate", "AI generator", "✨")}
      </div>

      {tab === "browse" ? (
        <div
          className="recipe-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
        >
          {recipes.map((recipe) => (
            <Link
              href={`/recipes/${recipe.slug}`}
              key={recipe.id}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e7e3dc",
                  borderRadius: "16px",
                  padding: "20px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {recipe.goals.map((goal) => {
                      const colors = goalColors[goal] || { bg: "#f0f0f0", color: "#666" };
                      return (
                        <span
                          key={goal}
                          style={{
                            fontSize: "11px",
                            background: colors.bg,
                            color: colors.color,
                            padding: "3px 9px",
                            borderRadius: "99px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {goal}
                        </span>
                      );
                    })}
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#9c9488",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                    }}
                  >
                    {recipe.prepTime} min
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#2d2a24",
                    marginBottom: "6px",
                    textTransform: "capitalize",
                  }}
                >
                  {recipe.name}
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b6560",
                    lineHeight: "1.6",
                    marginBottom: "14px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {recipe.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <span style={{ fontSize: "11px", color: "#9c9488" }}>
                      {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                    </span>
                    <span style={{ fontSize: "11px", color: "#9c9488" }}>
                      ~${recipe.costPerServing.toFixed(2)}/serving
                    </span>
                    <span style={{ fontSize: "11px", color: "#9c9488" }}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f" }}
                  >
                    Free →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <RecipeGenerator />
      )}
    </div>
  );
}

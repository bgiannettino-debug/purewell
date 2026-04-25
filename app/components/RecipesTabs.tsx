"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RecipeGenerator from "./RecipeGenerator";

type RecipeCard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
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
  // ── new ──
  mood: { bg: "#f4eef8", color: "#7a4f9c" },
  focus: { bg: "#eaf2f5", color: "#3d7088" },
  detox: { bg: "#eef5ee", color: "#4a7050" },
  kids: { bg: "#fdf5e9", color: "#a06030" },
  beauty: { bg: "#fdf0f3", color: "#a04060" },
};

// Type chip styling — kept in a single muted family so the type row reads as
// one filter group, distinct from the multi-colored goal chips above.
const typeMeta: Record<string, { label: string; emoji: string }> = {
  tea: { label: "Tea", emoji: "🍵" },
  tonic: { label: "Tonic", emoji: "💧" },
  syrup: { label: "Syrup", emoji: "🍯" },
  paste: { label: "Paste", emoji: "🥄" },
  smoothie: { label: "Smoothie", emoji: "🥤" },
  balm: { label: "Balm", emoji: "🧴" },
  tincture: { label: "Tincture", emoji: "💉" },
  "oil-blend": { label: "Oil blend", emoji: "🌿" },
  "bath-soak": { label: "Bath soak", emoji: "🛁" },
};

// Order the goal chips deliberately — common goals (sleep, stress, immune)
// up front, lifestyle/aesthetic ones at the end.
const ALL_GOALS = [
  "sleep",
  "stress",
  "immune",
  "energy",
  "focus",
  "mood",
  "gut",
  "detox",
  "joints",
  "hormones",
  "skin",
  "beauty",
  "kids",
];

const ALL_TYPES = [
  "tea",
  "tonic",
  "syrup",
  "paste",
  "smoothie",
  "balm",
  "tincture",
  "oil-blend",
  "bath-soak",
];

type Tab = "browse" | "generate";

export default function RecipesTabs({ recipes }: { recipes: RecipeCard[] }) {
  const [tab, setTab] = useState<Tab>("browse");
  // "all" = no filter applied. Keeping the two filters independent means a
  // user can ask for "all balms" without also having to pick a goal, and vice
  // versa. Most filters in the wild are AND'd together — that's what we do
  // when both are set.
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [goalFilter, setGoalFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (goalFilter !== "all" && !r.goals.includes(goalFilter)) return false;
      return true;
    });
  }, [recipes, typeFilter, goalFilter]);

  // Hide filter chips that would produce zero results given the current
  // selection. Keeps the UI honest — chips that "do nothing" are the most
  // common UX complaint with chip filters.
  const reachableTypes = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => {
      if (goalFilter === "all" || r.goals.includes(goalFilter)) set.add(r.type);
    });
    return set;
  }, [recipes, goalFilter]);

  const reachableGoals = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => {
      if (typeFilter === "all" || r.type === typeFilter) {
        r.goals.forEach((g) => set.add(g));
      }
    });
    return set;
  }, [recipes, typeFilter]);

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

  // Reusable chip — radio-style behaviour (clicking the active chip resets to
  // "all"). The `dimmed` flag is for chips that exist but would produce no
  // results given the other filter; we keep them visible but fade them so
  // the user understands why their choice matters.
  const filterChip = (
    label: string,
    value: string,
    selected: boolean,
    onSelect: () => void,
    options: { dimmed?: boolean; emoji?: string; goalKey?: string } = {},
  ) => {
    const goalCol = options.goalKey ? goalColors[options.goalKey] : undefined;
    const bg = selected
      ? goalCol?.bg ?? "#eef5f0"
      : options.dimmed
        ? "#f8f6f1"
        : "#fff";
    const color = selected
      ? goalCol?.color ?? "#3d6b4f"
      : options.dimmed
        ? "#c5bfb5"
        : "#6b6560";
    const border = selected
      ? `1px solid ${goalCol?.color ?? "#c8ddd0"}`
      : "1px solid #e7e3dc";
    return (
      <button
        key={value}
        onClick={onSelect}
        disabled={options.dimmed && !selected}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "12px",
          fontWeight: selected ? "600" : "500",
          padding: "6px 12px",
          borderRadius: "99px",
          border,
          background: bg,
          color,
          cursor: options.dimmed && !selected ? "not-allowed" : "pointer",
          textTransform: "capitalize",
          transition: "all 0.12s ease",
        }}
      >
        {options.emoji && <span style={{ fontSize: "12px" }}>{options.emoji}</span>}
        {label}
      </button>
    );
  };

  const filtersActive = typeFilter !== "all" || goalFilter !== "all";

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
        <>
          {/* Filters */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e7e3dc",
              borderRadius: "16px",
              padding: "16px 18px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Type row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#9c9488",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  paddingTop: "8px",
                  width: "44px",
                  flexShrink: 0,
                }}
              >
                Type
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {filterChip(
                  "All",
                  "all",
                  typeFilter === "all",
                  () => setTypeFilter("all"),
                )}
                {ALL_TYPES.map((t) =>
                  filterChip(
                    typeMeta[t]?.label ?? t,
                    t,
                    typeFilter === t,
                    () => setTypeFilter(typeFilter === t ? "all" : t),
                    {
                      dimmed: !reachableTypes.has(t),
                      emoji: typeMeta[t]?.emoji,
                    },
                  ),
                )}
              </div>
            </div>

            {/* Goal row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#9c9488",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  paddingTop: "8px",
                  width: "44px",
                  flexShrink: 0,
                }}
              >
                Goal
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {filterChip(
                  "All",
                  "all",
                  goalFilter === "all",
                  () => setGoalFilter("all"),
                )}
                {ALL_GOALS.map((g) =>
                  filterChip(
                    g,
                    g,
                    goalFilter === g,
                    () => setGoalFilter(goalFilter === g ? "all" : g),
                    {
                      dimmed: !reachableGoals.has(g),
                      goalKey: g,
                    },
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Result count + clear */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
              fontSize: "12px",
              color: "#9c9488",
            }}
          >
            <span>
              Showing {filtered.length} of {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
            </span>
            {filtersActive && (
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setGoalFilter("all");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3d6b4f",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px dashed #e7e3dc",
                borderRadius: "16px",
                padding: "48px 24px",
                textAlign: "center",
                color: "#6b6560",
                fontSize: "13px",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🌿</div>
              No recipes match these filters yet. Try clearing one — or use the AI generator to design something custom.
            </div>
          ) : (
            <div
              className="recipe-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
            >
              {filtered.map((recipe) => (
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
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                        {/* Type chip — neutral background so it doesn't fight
                            with the goal chips for attention. */}
                        <span
                          style={{
                            fontSize: "11px",
                            background: "#f5f2ed",
                            color: "#6b6560",
                            padding: "3px 9px",
                            borderRadius: "99px",
                            fontWeight: "500",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {typeMeta[recipe.type]?.emoji && (
                            <span>{typeMeta[recipe.type].emoji}</span>
                          )}
                          {typeMeta[recipe.type]?.label ?? recipe.type}
                        </span>
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
          )}
        </>
      ) : (
        <RecipeGenerator />
      )}
    </div>
  );
}

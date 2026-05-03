// Plain-text formatters that render structured content (recipes,
// analyzer results, quiz protocols) into the kind of text people
// expect to paste into Notes / Word / Mail. Bullets via "•", numbered
// steps via "1. ", section headers in ALL CAPS, source link at the
// bottom for attribution / re-find.
//
// Why plain text not Markdown: Apple Notes, Word, and Gmail all
// render plain bullets/numbers reliably across formatting reset, so
// ANY downstream app gets a clean paste. Markdown would render in
// some places (Notion, Obsidian) but show literal `**` characters
// in others (Notes, Word).

const SITE_URL = "https://purewellnatural.com";

// ───────────────────────────────────────────────────────────────────
// Recipe
// ───────────────────────────────────────────────────────────────────

type RecipeIngredient = { amount: string; name: string };
type RecipeStep = { step: number; title: string; instruction: string };
type RecipeShape = {
  name: string;
  slug: string;
  description: string;
  type: string;
  prepTime: number;
  servings: number;
  difficulty: string;
  goals: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export function formatRecipeForClipboard(r: RecipeShape): string {
  const goals = r.goals.length ? r.goals.join(", ") : "—";
  const ingredients = r.ingredients
    .map((i) => `• ${i.amount} ${i.name}`)
    .join("\n");
  const steps = r.steps
    .map((s) => `${s.step}. ${s.title}\n   ${s.instruction}`)
    .join("\n\n");

  return `${r.name.toUpperCase()}
${r.description}

Prep time: ${r.prepTime} min · Servings: ${r.servings} · Difficulty: ${r.difficulty}
Goals: ${goals}

INGREDIENTS
${ingredients}

INSTRUCTIONS
${steps}

—
Recipe from PureWell · ${SITE_URL}/recipes/${r.slug}`;
}

// ───────────────────────────────────────────────────────────────────
// Label analyzer result
// ───────────────────────────────────────────────────────────────────

type AnalyzerIngredient = {
  name: string;
  purpose: string;
  quality: "good" | "neutral" | "warning";
  note: string;
};

type AnalyzerShape = {
  productName: string;
  brand: string | null;
  category: string;
  overallRating: number;
  overallVerdict: string;
  summary: string;
  ingredients: AnalyzerIngredient[];
  concerns?: string[];
};

const QUALITY_PREFIX: Record<AnalyzerIngredient["quality"], string> = {
  good: "✓",
  neutral: "·",
  warning: "⚠",
};

export function formatAnalyzerResultForClipboard(a: AnalyzerShape): string {
  const header = `${a.productName.toUpperCase()}${a.brand ? `\nby ${a.brand}` : ""}`;
  const meta = `Category: ${a.category}\nOverall: ${a.overallRating}/10 — ${a.overallVerdict}`;
  const ingredients = a.ingredients
    .map(
      (i) =>
        `${QUALITY_PREFIX[i.quality]} ${i.name}${i.purpose ? ` (${i.purpose})` : ""}\n   ${i.note}`,
    )
    .join("\n\n");
  const concerns =
    a.concerns && a.concerns.length
      ? `\n\nCONCERNS\n${a.concerns.map((c) => `• ${c}`).join("\n")}`
      : "";

  return `${header}

${meta}

SUMMARY
${a.summary}

INGREDIENT BREAKDOWN
${ingredients}${concerns}

—
Analyzed by PureWell · ${SITE_URL}/analyze`;
}

// ───────────────────────────────────────────────────────────────────
// Quiz protocol
// ───────────────────────────────────────────────────────────────────

type ProtocolItemSupplement = {
  kind: "supplement";
  timing: string;
  reason: string;
  product: { name: string; brand: string; price: number; slug: string };
};

type ProtocolItemRecipe = {
  kind: "recipe";
  timing: string;
  reason: string;
  recipe: { name: string; slug: string; type: string; prepTime: number };
};

type ProtocolShape = {
  protocolName: string;
  summary: string;
  weeklyTip: string;
  items: (ProtocolItemSupplement | ProtocolItemRecipe)[];
};

export function formatProtocolForClipboard(p: ProtocolShape): string {
  const items = p.items
    .map((item, i) => {
      if (item.kind === "supplement") {
        const pr = item.product;
        return `${i + 1}. ${pr.name} — ${pr.brand} ($${pr.price.toFixed(2)})\n   Timing: ${item.timing}\n   Why: ${item.reason}\n   ${SITE_URL}/products/${pr.slug}`;
      }
      const r = item.recipe;
      return `${i + 1}. ${r.name} (recipe · ${r.type}, ${r.prepTime} min)\n   Timing: ${item.timing}\n   Why: ${item.reason}\n   ${SITE_URL}/recipes/${r.slug}`;
    })
    .join("\n\n");

  return `${p.protocolName.toUpperCase()}
${p.summary}

YOUR PLAN
${items}

WEEKLY TIP
${p.weeklyTip}

—
Plan from PureWell · ${SITE_URL}/quiz`;
}

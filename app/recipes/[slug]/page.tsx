import Link from "next/link";
import Image from "next/image";
import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EmailOptIn from "../../components/EmailOptIn";
import CopyButton from "../../components/CopyButton";
import { formatRecipeForClipboard } from "../../../lib/clipboardFormatters";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await db.recipe.findUnique({ where: { slug } });

  if (!recipe) return { title: "Recipe not found" };

  const goals = recipe.goals as string[];

  return {
    title: recipe.name,
    description: `${recipe.description} Prep time: ${recipe.prepTime} minutes. Goals: ${goals.join(", ")}. Free DIY wellness recipe.`,
    openGraph: {
      title: recipe.name,
      description: recipe.description,
    },
  };
}

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
  // ── new ──
  mood:    { bg: "#f4eef8", color: "#7a4f9c" },
  focus:   { bg: "#eaf2f5", color: "#3d7088" },
  detox:   { bg: "#eef5ee", color: "#4a7050" },
  kids:    { bg: "#fdf5e9", color: "#a06030" },
  beauty:  { bg: "#fdf0f3", color: "#a04060" },
};

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

type Props = {
  params: Promise<{ slug: string }>;
  // searchParams lets us detect referral context without document.referrer
  // (which is unreliable across redirects and direct shares). The quiz
  // results page appends ?from=quiz so we can offer "Back to
  // recommendations" instead of the default "Back to recipes".
  searchParams: Promise<{ from?: string }>;
};

export default async function RecipePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;
  const fromQuiz = from === "quiz";

  const recipe = await db.recipe.findUnique({
    where: { slug },
  });

  if (!recipe) notFound();

  const goals = recipe.goals as string[];
  const steps = recipe.steps as Step[];
  const ingredients = recipe.ingredients as Ingredient[];

  // Pull a candidate pool of recipes that share at least one goal OR
  // the same type. We rank in JS rather than in SQL because Prisma's
  // array-overlap operators don't support custom scoring — and the
  // pool is small enough (a few dozen recipes max) that this is
  // trivial. Score: +1 per shared goal, +0.5 if same type, capped
  // top 4. Keeps the "you might also like" relevant without surfacing
  // unrelated recipes.
  const relatedCandidates = await db.recipe.findMany({
    where: {
      slug: { not: recipe.slug },
      OR: [
        { goals: { hasSome: goals } },
        { type: recipe.type },
      ],
    },
  });
  const relatedRecipes = relatedCandidates
    .map((r) => {
      const sharedGoals = (r.goals as string[]).filter((g) => goals.includes(g)).length;
      const typeMatch = r.type === recipe.type ? 0.5 : 0;
      return { recipe: r, score: sharedGoals + typeMatch };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.recipe);

  // Match recipe ingredients to products in the catalog so we can
  // suggest "use these in your kitchen" cross-sells. Loose match:
  // any product whose name contains an ingredient keyword (or vice
  // versa). Handful of products at most so a simple fetch+filter is
  // fine. Excludes the empty-keyword case.
  const ingredientKeywords = ingredients
    .map((i) => i.name.toLowerCase())
    .filter((n) => n.length > 3);
  const allProducts =
    ingredientKeywords.length > 0
      ? await db.product.findMany({
          where: { inStock: true },
          select: { id: true, slug: true, name: true, brand: true, imageUrl: true, price: true },
        })
      : [];
  const matchedProducts = allProducts
    .filter((p) =>
      ingredientKeywords.some((kw) => {
        const productName = p.name.toLowerCase();
        return productName.includes(kw) || kw.includes(productName.split(" ")[0]);
      }),
    )
    .slice(0, 3);

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Back link — context-aware. Coming from the quiz protocol
            takes the user back to their recommendations rather than
            dropping them in the full recipe browser. */}
        <Link
          href={fromQuiz ? "/quiz/results" : "/recipes"}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#6b6560", textDecoration: "none", marginBottom: "24px" }}
        >
          ← {fromQuiz ? "Back to recommendations" : "Back to recipes"}
        </Link>

        {/* Type + goal tags */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
          {recipe.type && (
            <span
              style={{ fontSize: "11px", background: "#f5f2ed", color: "#6b6560", padding: "4px 10px", borderRadius: "99px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              {typeMeta[recipe.type]?.emoji && (
                <span>{typeMeta[recipe.type].emoji}</span>
              )}
              {typeMeta[recipe.type]?.label ?? recipe.type}
            </span>
          )}
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

        {/* Title + copy-to-clipboard. Copy button puts the recipe
            (ingredients + numbered steps + meta + source link) onto
            the clipboard as plain text — drops cleanly into Notes,
            Word, Mail, etc. without retyping. */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#2d2a24", textTransform: "capitalize", margin: 0, flex: "1 1 auto", minWidth: 0 }}>
            {recipe.name}
          </h1>
          <CopyButton
            text={formatRecipeForClipboard({
              name: recipe.name,
              slug: recipe.slug,
              description: recipe.description,
              type: recipe.type,
              prepTime: recipe.prepTime,
              servings: recipe.servings,
              difficulty: recipe.difficulty,
              goals: goals,
              ingredients: ingredients,
              steps: steps,
            })}
            label="Copy recipe"
          />
        </div>
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

        {/* Email opt-in — lets users send the recipe to themselves so
            they can cook from their phone without juggling tabs in the
            kitchen. The payload shape matches RecipeEmailPayload in
            lib/emailTemplates.ts. */}
        <div style={{ marginBottom: "16px" }}>
          <EmailOptIn
            type="recipe"
            referenceId={recipe.slug}
            payload={{
              name: recipe.name,
              slug: recipe.slug,
              description: recipe.description,
              type: recipe.type,
              prepTime: recipe.prepTime,
              servings: recipe.servings,
              costPerServing: recipe.costPerServing,
              difficulty: recipe.difficulty,
              ingredients,
              steps,
            }}
          />
        </div>

        {/* Shop CTA */}
        <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d2a24", marginBottom: "4px" }}>
            Shop for ingredients
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

        {/* Cross-sell: matched products from the catalog that show up
            in this recipe's ingredient list. Light suggestion ('shop
            ingredients'), not a hard CTA. Only renders when at least
            one ingredient maps to an in-stock product. */}
        {matchedProducts.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
              Shop ingredients
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }} className="related-grid">
              {matchedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "12px", padding: "10px", textDecoration: "none", display: "block" }}
                >
                  <div style={{ position: "relative", width: "100%", height: "80px", background: "#f5f2ed", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}>
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt={p.name} fill style={{ objectFit: "contain" }} />
                    )}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "2px" }}>{p.brand}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#2d2a24", lineHeight: 1.3, marginBottom: "4px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#3d6b4f" }}>${p.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related recipes — ranked by shared goals + same type so the
            suggestion is genuinely contextual, not random. Hidden if
            the catalog has no overlapping recipes (early-stage state). */}
        {relatedRecipes.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
              You might also like
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }} className="related-grid">
              {relatedRecipes.map((r) => {
                const rGoals = r.goals as string[];
                return (
                  <Link
                    key={r.id}
                    href={`/recipes/${r.slug}`}
                    style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "12px", padding: "12px", textDecoration: "none", display: "block" }}
                  >
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <span style={{ fontSize: "10px", background: "#f5f2ed", color: "#6b6560", padding: "2px 8px", borderRadius: "99px", fontWeight: 500, textTransform: "capitalize" }}>
                        {r.type}
                      </span>
                      {rGoals.slice(0, 2).map((g) => (
                        <span key={g} style={{ fontSize: "10px", background: "#eef5f0", color: "#3d6b4f", padding: "2px 8px", borderRadius: "99px", fontWeight: 500, textTransform: "capitalize" }}>
                          {g}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2a24", lineHeight: 1.3, marginBottom: "4px", textTransform: "capitalize" }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9c9488" }}>
                      {r.prepTime} min · ${r.costPerServing.toFixed(2)}/serving
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ fontSize: "11px", color: "#9c9488", textAlign: "center", lineHeight: 1.6 }}>
          These recipes are for general wellness purposes only and have not been evaluated by the FDA.
          Consult your healthcare provider before use if pregnant, nursing, or on medications.
        </div>
      </div>
      <Footer />
    </main>
  );
}
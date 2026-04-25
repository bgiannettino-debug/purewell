import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "../../../lib/db";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Shape Claude returns. We'll enrich each item with full product/recipe
// data before sending to the client so the results page can render
// action buttons (Add to cart, View recipe) without a second roundtrip.
type ClaudeItem = {
  kind: "supplement" | "recipe";
  productId?: string | null; // present when kind === "supplement"
  recipeSlug?: string | null; // present when kind === "recipe"
  timing: "morning" | "afternoon" | "evening";
  reason: string;
};

type ClaudeProtocol = {
  protocolName: string;
  summary: string;
  items: ClaudeItem[];
  weeklyTip: string;
};

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();

    // Pull the catalog. We send a trimmed view to Claude (just what's
    // needed for matching) to keep the prompt small. The full records
    // are looked up after Claude responds, so we don't need to
    // round-trip name + image + affiliate URL through the model.
    const [products, recipes] = await Promise.all([
      db.product.findMany({
        where: { inStock: true },
        select: {
          id: true, name: true, brand: true, slug: true,
          description: true, price: true, category: true,
        },
      }),
      db.recipe.findMany({
        select: {
          slug: true, name: true, description: true, type: true,
          goals: true, prepTime: true, costPerServing: true,
        },
      }),
    ]);

    const supplementCatalog = products
      .map((p) => `[id: ${p.id}] ${p.name} by ${p.brand} (${p.category}, $${p.price}) — ${p.description}`)
      .join("\n");
    const recipeCatalog = recipes
      .map((r) => `[slug: ${r.slug}] ${r.name} (${r.type}, prep ${r.prepTime}min, $${r.costPerServing.toFixed(2)}/serving, goals: ${(r.goals as string[]).join(", ")}) — ${r.description}`)
      .join("\n");

    const systemPrompt = `You are PureWell's AI wellness protocol designer.

You will be given the user's quiz answers and a catalog of real supplements and recipes available on PureWell. Your job is to pick 2-3 items from this catalog that best fit the user's goals, dietary preferences, format preference, and budget.

Format preference guidance:
- "diy" — favor recipes
- "supplements" — favor supplements
- "mixed" — balance both

You MUST only pick items that exist in the catalog below. Reference each pick by its catalog id (for supplements) or slug (for recipes).

Respond with ONLY a raw JSON object — no markdown, no code blocks, no backticks, no explanation.
Start your response directly with { and end with }.

The JSON must match this exact structure:
{
  "protocolName": "string",
  "summary": "string (2-3 sentences explaining why these picks fit them)",
  "items": [
    {
      "kind": "supplement",
      "productId": "the catalog id (string)",
      "timing": "morning" | "afternoon" | "evening",
      "reason": "string (one sentence why this product helps their goals)"
    },
    {
      "kind": "recipe",
      "recipeSlug": "the catalog slug (string)",
      "timing": "morning" | "afternoon" | "evening",
      "reason": "string (one sentence why this recipe helps their goals)"
    }
  ],
  "weeklyTip": "string (one actionable wellness tip for this person)"
}

Pick a maximum of 3 items. Keep language warm, evidence-based, and never make disease treatment claims.

=== AVAILABLE SUPPLEMENTS ===
${supplementCatalog || "(no supplements currently available)"}

=== AVAILABLE RECIPES ===
${recipeCatalog || "(no recipes currently available)"}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Please create a wellness protocol for someone with these answers:
- Health goals: ${answers.goals.join(", ")}
- Current stress level: ${answers.stressLevel} out of 5
- Dietary preferences: ${answers.diet.join(", ")}
- Preferred format: ${answers.format}
- Monthly budget: ${answers.budget}
- How long dealing with these concerns: ${answers.duration}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Strip any stray markdown fencing Claude might still add despite
    // the explicit instruction not to.
    const cleaned = content.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const claudeProtocol: ClaudeProtocol = JSON.parse(cleaned);

    // Enrich Claude's references with the full DB rows so the results
    // page can render action buttons without another roundtrip. If
    // Claude hallucinates an id/slug despite the catalog, drop the
    // item rather than ship a broken card.
    const enrichedItems = await Promise.all(
      claudeProtocol.items.map(async (item) => {
        if (item.kind === "supplement" && item.productId) {
          const product = await db.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) return null;
          return {
            kind: "supplement" as const,
            timing: item.timing,
            reason: item.reason,
            product,
          };
        }
        if (item.kind === "recipe" && item.recipeSlug) {
          const recipe = await db.recipe.findUnique({
            where: { slug: item.recipeSlug },
          });
          if (!recipe) return null;
          return {
            kind: "recipe" as const,
            timing: item.timing,
            reason: item.reason,
            recipe: {
              slug: recipe.slug,
              name: recipe.name,
              description: recipe.description,
              type: recipe.type,
              prepTime: recipe.prepTime,
              costPerServing: recipe.costPerServing,
              goals: recipe.goals as string[],
            },
          };
        }
        return null;
      }),
    );

    const protocol = {
      protocolName: claudeProtocol.protocolName,
      summary: claudeProtocol.summary,
      weeklyTip: claudeProtocol.weeklyTip,
      items: enrichedItems.filter((i): i is NonNullable<typeof i> => i !== null),
    };

    return NextResponse.json({ protocol });

  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to generate protocol", details: String(error) },
      { status: 500 }
    );
  }
}

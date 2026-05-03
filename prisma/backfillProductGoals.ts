import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

// One-time backfill: loop every product in the catalog, ask Claude
// which wellness goals it supports, and save the result on the
// product. Idempotent — running it again on already-tagged products
// will overwrite their goals (so feel free to re-run if the prompt
// gets refined). Costs roughly $0.05 for ~30 products at current
// claude-haiku pricing.
//
// Run from the project root:
//   npx tsx prisma/backfillProductGoals.ts
//
// Or to backfill ONLY products with empty goals (skip already-tagged):
//   npx tsx prisma/backfillProductGoals.ts --only-empty

const VALID_GOALS = [
  "sleep",
  "stress",
  "energy",
  "immune",
  "gut",
  "joints",
  "hormones",
  "skin",
  "mood",
  "focus",
  "detox",
  "kids",
  "beauty",
];

const onlyEmpty = process.argv.includes("--only-empty");

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function inferGoals(name: string, brand: string, description: string): Promise<string[]> {
  const message = await anthropic.messages.create({
    // Haiku is cheaper and plenty smart for this classification task.
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Classify this natural-wellness product into 1-3 goals from this exact list: ${VALID_GOALS.join(", ")}.

Be precise based on ingredients and known benefits:
- ashwagandha → stress, sleep, mood
- magnesium glycinate → sleep, stress
- collagen → skin, joints, beauty
- vitamin D3 → immune, mood
- elderberry → immune
- turmeric → joints
- probiotics → gut, immune
- omega-3 → mood, focus, joints
- biotin → skin, beauty
- maca → energy, hormones

Respond with ONLY a JSON array of goal strings, nothing else. Example: ["stress","sleep"]

If the product is too generic to map to specific goals, return an empty array: []

Product: ${name} by ${brand}
Description: ${description}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") return [];

  // Strip any stray markdown fencing
  const cleaned = content.text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((g) => typeof g === "string" && VALID_GOALS.includes(g));
  } catch {
    return [];
  }
}

async function main() {
  const products = await prisma.product.findMany({
    where: onlyEmpty ? { goals: { isEmpty: true } } : undefined,
    orderBy: { createdAt: "asc" },
  });

  console.log(`Backfilling goals for ${products.length} products${onlyEmpty ? " (only empty)" : ""}...`);

  let success = 0;
  let empty = 0;
  let failed = 0;

  for (const p of products) {
    try {
      const goals = await inferGoals(p.name, p.brand, p.description);
      await prisma.product.update({
        where: { id: p.id },
        data: { goals },
      });
      const status = goals.length === 0 ? "  (no clear match)" : `  → ${goals.join(", ")}`;
      console.log(`✓ ${p.brand} — ${p.name}${status}`);
      if (goals.length === 0) empty++;
      else success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${p.brand} — ${p.name}: ${msg}`);
      failed++;
    }
  }

  console.log(
    `\nDone. Tagged ${success}, skipped ${empty} (no clear match), failed ${failed} of ${products.length}.`,
  );
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

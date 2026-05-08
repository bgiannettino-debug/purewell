// One-shot script: reads prisma/recipe-images.json and pushes the imageUrl
// values into the Recipe table. Idempotent — re-running it just overwrites
// imageUrl with whatever's in the JSON. Empty strings are skipped (so you
// can leave half the file blank and only update the slugs you've filled in).
//
// Run with:
//   pnpm tsx prisma/updateRecipeImages.ts
//
// The script reads DATABASE_URL the same way the seed scripts do. If you
// have DIRECT_URL configured for Prisma migrations, the runtime URL is
// fine here — we're issuing simple UPDATE statements, not DDL.

import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

type ImageMap = Record<string, string>;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Make sure .env or .env.local has it.",
    );
  }

  const jsonPath = resolve(__dirname, "recipe-images.json");
  const raw = readFileSync(jsonPath, "utf8");
  const parsed = JSON.parse(raw) as ImageMap;

  // Strip the _README block — it's documentation, not data.
  const entries = Object.entries(parsed).filter(
    ([slug, url]) => slug !== "_README" && typeof url === "string",
  );

  const adapter = new PrismaPg({ connectionString });
  const db = new PrismaClient({ adapter });

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const [slug, url] of entries) {
    if (!url.trim()) {
      skipped++;
      continue;
    }

    // updateMany rather than update so a missing slug doesn't throw — we
    // want a clean count at the end, not a half-finished run.
    const result = await db.recipe.updateMany({
      where: { slug },
      data: { imageUrl: url },
    });

    if (result.count === 0) {
      console.warn(`  ⚠  no recipe found for slug "${slug}" — skipped`);
      missing++;
    } else {
      console.log(`  ✓  ${slug}`);
      updated++;
    }
  }

  console.log(
    `\nDone. ${updated} updated, ${skipped} blank (skipped), ${missing} unmatched.`,
  );

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

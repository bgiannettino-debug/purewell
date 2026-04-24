import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "../../../../lib/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VALID_CATEGORIES = [
  "supplements",
  "essential-oils",
  "herbal-teas",
  "skincare",
  "nutrition",
  "fitness",
];

type RecommendRequest = {
  category?: string;
  productType?: string;
  concerns?: string[];
  scannedBrand?: string | null;
  scannedProductName?: string | null;
  scannedRating?: number | null;
};

/**
 * Picks a cleaner alternative from the PureWell catalog after a label scan.
 *
 * Flow:
 * 1. Validate category, query in-stock products in that category.
 * 2. Drop the scanned product itself if it's in the catalog (brand+productType match).
 * 3. If the scanned product already rated 9+, no card — they're already on a clean pick.
 * 4. Otherwise hand the shortlist to Claude with the analyzer's concerns and let
 *    it pick the best alternative or return null. Claude also writes the one-line
 *    "why this is cleaner" reason so the card reads as continuous reasoning rather
 *    than two disconnected blurbs.
 */
export async function POST(req: NextRequest) {
  try {
    const body: RecommendRequest = await req.json();
    const { category, productType, concerns, scannedBrand, scannedProductName, scannedRating } = body;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ product: null, reason: null });
    }

    // If the scanned product already scored very well, recommending an
    // alternative would feel like upselling for upselling's sake.
    if (typeof scannedRating === "number" && scannedRating >= 9) {
      return NextResponse.json({ product: null, reason: null });
    }

    const candidates = await db.product.findMany({
      where: { category, inStock: true },
      orderBy: { createdAt: "asc" },
    });

    if (candidates.length === 0) {
      return NextResponse.json({ product: null, reason: null });
    }

    // Drop anything that looks like the scanned product itself so we don't
    // recommend it back. Brand match alone is enough — even if the catalog
    // carries other SKUs from that brand, the user just scanned one of them
    // and we don't want to pitch a sibling SKU as "cleaner".
    const filtered = scannedBrand
      ? candidates.filter(
          (p) => p.brand.trim().toLowerCase() !== scannedBrand.trim().toLowerCase(),
        )
      : candidates;

    if (filtered.length === 0) {
      return NextResponse.json({ product: null, reason: null });
    }

    // Compact shape to send to Claude. Keep it small — id is the join key,
    // everything else is signal for picking.
    const shortlist = filtered.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      description: p.description,
      certifications: p.certifications,
    }));

    const userPayload = {
      scannedProduct: {
        name: scannedProductName || null,
        brand: scannedBrand || null,
        productType: productType || null,
        concerns: concerns || [],
        rating: scannedRating ?? null,
      },
      shortlist,
    };

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `You are helping a wellness shopper who just scanned a supplement/wellness label. Pick the cleanest alternative from the shortlist that addresses the concerns flagged on the scanned product.

Rules:
- Only recommend a product if it is meaningfully better than what they scanned (more certifications, addresses a flagged concern, or is a cleaner formulation of the same product type).
- If the productType doesn't match anything in the shortlist, return {"productId": null, "reason": null}. Do NOT force a recommendation across product types (don't recommend vitamin D when they scanned magnesium).
- If nothing in the shortlist is clearly better, return {"productId": null, "reason": null}.
- The reason must be ONE short sentence (under 20 words) that names a concrete reason — a certification, a missing concern, a cleaner ingredient. No marketing fluff.

Respond with ONLY valid JSON starting with { — no markdown, no backticks.

{"productId": "string id from shortlist or null", "reason": "string under 20 words or null"}

Input:
${JSON.stringify(userPayload)}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ product: null, reason: null });
    }

    const cleaned = content.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: { productId: string | null; reason: string | null };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ product: null, reason: null });
    }

    if (!parsed.productId) {
      return NextResponse.json({ product: null, reason: null });
    }

    const picked = filtered.find((p) => p.id === parsed.productId);
    if (!picked) {
      // Claude hallucinated an id — bail rather than show something wrong.
      return NextResponse.json({ product: null, reason: null });
    }

    return NextResponse.json({
      product: {
        id: picked.id,
        slug: picked.slug,
        name: picked.name,
        brand: picked.brand,
        imageUrl: picked.imageUrl,
        certifications: picked.certifications,
      },
      reason: parsed.reason,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Recommend error:", err.message);
    // Soft-fail: the analyzer page is useful even without a recommendation.
    return NextResponse.json({ product: null, reason: null });
  }
}

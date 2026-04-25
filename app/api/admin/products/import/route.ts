import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VALID_CATEGORIES = [
  "supplements",
  "essential-oils",
  "herbal-teas",
  "skincare",
  "nutrition",
  "fitness",
];

const VALID_CERTIFICATIONS = [
  "USDA Organic",
  "Non-GMO",
  "Vegan",
  "Gluten-free",
  "GMP Certified",
  "Third-party tested",
  "Kosher",
  "Fair Trade",
];

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

/**
 * Pull a 10-character ASIN out of an Amazon URL. Covers /dp/, /gp/product/,
 * and the variant where Amazon stuffs the ASIN as a query param. Returns null
 * if nothing recognisable is in the string — caller decides what to do then.
 */
function extractAsin(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /\/gp\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /\/gp\/aw\/d\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /[?&]asin=([A-Z0-9]{10})/i,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

/**
 * Slugify a product name the same way the new-product form does so the
 * pre-filled draft round-trips through the existing PUT/POST flow without the
 * admin needing to retype it.
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * POST /api/admin/products/import
 *
 * Body: { affiliateUrl: string, pageText: string, imageUrl?: string }
 *
 * Sends the pasted Amazon product page text through Claude to extract a
 * structured draft matching the Product schema. The admin reviews and saves
 * via the existing /api/admin/products POST — this endpoint never writes.
 *
 * Designed so a future PA-API path can replace the extractFromText step
 * without changing the response shape or the import page.
 */
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { affiliateUrl, pageText, imageUrl } = await req.json();

    if (!affiliateUrl || typeof affiliateUrl !== "string") {
      return NextResponse.json({ error: "affiliateUrl is required" }, { status: 400 });
    }
    if (!pageText || typeof pageText !== "string" || pageText.trim().length < 50) {
      return NextResponse.json(
        { error: "pageText is required (paste the Amazon product page contents)" },
        { status: 400 },
      );
    }

    const asin = extractAsin(affiliateUrl);

    // Trim aggressively — the typical Amazon product page Cmd+A grab is huge
    // and most of it is footer/recommendations noise. The first ~12k chars
    // reliably contain title, brand, bullets, and description.
    const trimmedText = pageText.slice(0, 12000);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are extracting product data from raw text copied off an Amazon product page. Respond with ONLY valid JSON starting with { — no markdown, no backticks.

Schema:
{
  "name": "string — the product name as it appears on the page, brand removed if it duplicates the brand field",
  "brand": "string — the manufacturer / brand",
  "description": "string — 2–4 sentences synthesised from the bullet points and product description. Plain prose, no marketing fluff, no all-caps.",
  "price": number — the current numeric price in USD, no currency symbol. Use the main listed price, not subscribe-and-save or used,
  "category": "one of: ${VALID_CATEGORIES.join(", ")}",
  "certifications": ["zero or more from this exact list: ${VALID_CERTIFICATIONS.join(", ")}"],
  "confidence": "high or medium or low — how confident you are the extraction is correct"
}

Rules:
- category MUST be exactly one of the listed values. Pick the closest fit.
- certifications MUST come from the listed values verbatim. Only include ones explicitly claimed on the page; never infer. Empty array if none.
- If the page text doesn't include a price, set price to 0 and confidence to "low".
- If the text is clearly not an Amazon product page, return {"error": "Page text doesn't look like an Amazon product page"}.

Page text:
"""
${trimmedText}
"""`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
    }

    const cleaned = content.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let extracted: {
      name?: string;
      brand?: string;
      description?: string;
      price?: number;
      category?: string;
      certifications?: string[];
      confidence?: string;
      error?: string;
    };
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Could not parse extraction. Try pasting the page text again." },
        { status: 500 },
      );
    }

    if (extracted.error) {
      return NextResponse.json({ error: extracted.error }, { status: 400 });
    }

    // Validate category and certifications against the canonical lists. Drop
    // anything that doesn't match exactly — better to show an empty field the
    // admin can fill than a free-text value that breaks the filter buckets.
    const category = VALID_CATEGORIES.includes(extracted.category || "")
      ? extracted.category
      : "supplements";

    const certifications = (extracted.certifications || []).filter((c) =>
      VALID_CERTIFICATIONS.includes(c),
    );

    const name = (extracted.name || "").trim();

    return NextResponse.json({
      draft: {
        name,
        slug: name ? toSlug(name) : "",
        brand: (extracted.brand || "").trim(),
        description: (extracted.description || "").trim(),
        price: typeof extracted.price === "number" ? extracted.price.toString() : "",
        category,
        certifications,
        imageUrl: imageUrl?.trim() || "",
        affiliateUrl: affiliateUrl.trim(),
        supplier: "amazon",
        asin: asin || "",
      },
      confidence: extracted.confidence || "medium",
      asinDetected: !!asin,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Import extraction error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to extract product" },
      { status: 500 },
    );
  }
}

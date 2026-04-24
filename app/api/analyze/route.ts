import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const base64Data = image.split(",")[1];
    const mimeMatch = image.match(/data:([^;]+);/);
    const mediaType = (mimeMatch?.[1] || "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Data },
          },
          {
            type: "text",
            text: `You are a supplement expert. Analyze this label and respond with ONLY valid JSON starting with {. No markdown, no backticks.

{
  "productName": "string",
  "brand": "string or null",
  "category": "one of: supplements, essential-oils, herbal-teas, skincare, nutrition, fitness",
  "productType": "string short canonical type, e.g. 'magnesium glycinate', 'vitamin d3', 'lavender essential oil', 'whey protein'. Lowercase, no brand names.",
  "overallRating": number 1-10,
  "overallVerdict": "string one sentence",
  "summary": "string 2-3 sentences",
  "ingredients": [{"name": "string", "purpose": "string", "quality": "good or neutral or warning", "note": "string"}],
  "concerns": ["short tags for things wrong with the product, e.g. 'artificial sweeteners', 'fillers', 'low dose', 'magnesium oxide form'. Empty array if none."],
  "redFlags": ["string"],
  "positives": ["string"],
  "recommendation": "string 2-3 sentences",
  "betterAlternative": "string or null"
}

Be direct and evidence-based. Never make disease treatment claims. The 'category' must be exactly one of the listed options. The 'productType' is used to match this product against a catalog of cleaner alternatives, so keep it canonical and brand-free.`,
          },
        ],
      }],
    });

    const content = message.content[0];
    if (content.type !== "text") return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });

    const cleaned = content.text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    const analysis = JSON.parse(cleaned);
    return NextResponse.json({ analysis });

  } catch (error) {
    const err = error as Error;
    console.error("Analyze error:", err.message);
    return NextResponse.json({ error: err.message || "Failed to analyze" }, { status: 500 });
  }
}

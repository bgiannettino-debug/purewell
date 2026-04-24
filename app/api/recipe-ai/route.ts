import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { goals, ingredients } = (await req.json()) as {
      goals: string[];
      ingredients: string[];
    };

    if (!Array.isArray(goals) || goals.length === 0) {
      return NextResponse.json(
        { error: "Please pick at least one health goal." },
        { status: 400 }
      );
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Please list at least one ingredient you have at home." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `You are PureWell's AI DIY wellness recipe designer.
A user tells you (a) the health goals they want to support and (b) the ingredients they already have at home.
You design ONE simple DIY wellness recipe (a drink, tonic, tea, shot, broth, smoothie, oatmeal, overnight soak, topical, or similar) that:
- Uses ONLY ingredients from the user's list, plus commonly available basics like water, ice, hot water.
- Does NOT require ingredients the user didn't mention. Do not invent. If the user's list is too sparse, pick the best simple recipe you can with what they have.
- Is safe, non-medicinal in framing, and appropriate for a general adult audience.
- Is genuinely useful for their stated goals — not just a smoothie with a trendy name.

You must respond with ONLY a raw JSON object — no markdown, no code blocks, no backticks, no explanation.
Start your response directly with { and end with }.
The JSON must match this exact structure:
{
  "recipeName": "string (short, appealing)",
  "whyItWorks": "string (1-2 sentences, plain language, explain how the chosen ingredients support the user's goals)",
  "prepTime": "string (e.g. '5 minutes')",
  "servings": 1,
  "ingredients": [
    { "name": "string", "amount": "string (e.g. '1 tsp', '1 cup', '1 thumb-sized piece')" }
  ],
  "steps": ["string", "string"],
  "tip": "string (optional one-line tip for best results, can be empty string)"
}

Rules:
- Warm, evidence-informed tone. Never make disease treatment claims.
- Do not suggest dosages of anything prescription-like.
- 3-7 ingredients. 3-6 steps. Keep it achievable in a home kitchen.
- If the user's goals include 'Sore throat' or 'Headache' or similar symptoms, frame as 'supports comfort' not 'treats'.`,
      messages: [
        {
          role: "user",
          content: `Design a DIY wellness recipe for me.

Health goals I want to support: ${goals.join(", ")}
Ingredients I have at home: ${ingredients.join(", ")}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Strip markdown code blocks if Claude added them
    const cleaned = content.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const recipe = JSON.parse(cleaned);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe AI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe", details: String(error) },
      { status: 500 }
    );
  }
}

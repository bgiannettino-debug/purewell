import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are PureWell's AI wellness protocol designer. 
Based on a user's quiz answers, create a personalized natural health protocol.
You must respond with ONLY a raw JSON object — no markdown, no code blocks, no backticks, no explanation.
Start your response directly with { and end with }.
The JSON must match this exact structure:
{
  "protocolName": "string",
  "summary": "string (2-3 sentences explaining why this plan fits them)",
  "items": [
    {
      "type": "supplement or recipe",
      "name": "string",
      "timing": "morning or afternoon or evening",
      "reason": "string (one sentence why this helps their goals)",
      "estimatedCost": "string (e.g. $24.95/mo or Free)"
    }
  ],
  "weeklyTip": "string (one actionable wellness tip for this person)"
}
Recommend 3 items maximum. Keep language warm, evidence-based, and never make disease treatment claims.`,
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

    // Strip markdown code blocks if Claude added them
    const cleaned = content.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const protocol = JSON.parse(cleaned);
    return NextResponse.json({ protocol });

  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to generate protocol", details: String(error) },
      { status: 500 }
    );
  }
}
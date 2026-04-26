import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import {
  renderProtocolEmail,
  renderRecipeEmail,
  type ProtocolEmailPayload,
  type RecipeEmailPayload,
} from "../../../../lib/emailTemplates";

// POST /api/email/send
// {
//   email: string,
//   type: "quiz-protocol" | "recipe",
//   payload: ProtocolEmailPayload | RecipeEmailPayload,
//   marketingOptIn?: boolean,
//   referenceId?: string
// }
//
// Stores a Subscriber row, then sends the rendered email via Resend.
// We deliberately avoid the resend npm package and call the API
// directly with fetch — keeps the dependency footprint smaller and
// avoids a build step on schema-only changes.
//
// SENDER NOTE: until you verify a domain at resend.com, the From
// must be an @resend.dev address and emails can only be delivered
// to the address you signed up with. After verification, swap
// FROM_ADDRESS to e.g. "PureWell <hello@purewellnatural.com>".

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "PureWell <onboarding@resend.dev>";
const SITE_URL = "https://purewellnatural.com";

const isValidEmail = (e: string) =>
  typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Don't pretend things worked when they didn't — better to
      // surface this loudly so the missing env var gets fixed.
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { email, type, payload, marketingOptIn, referenceId } = body as {
      email?: string;
      type?: string;
      payload?: ProtocolEmailPayload | RecipeEmailPayload;
      marketingOptIn?: boolean;
      referenceId?: string;
    };

    if (!isValidEmail(email ?? "")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (type !== "quiz-protocol" && type !== "recipe") {
      return NextResponse.json({ error: "Unsupported email type." }, { status: 400 });
    }
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Email payload is required." }, { status: 400 });
    }

    const normalisedEmail = (email as string).trim().toLowerCase();

    // If this address has previously unsubscribed (any source), respect
    // that and don't send. We still return 200 + a friendly message —
    // exposing "this email is unsubscribed" would let an attacker probe
    // membership.
    const prior = await db.subscriber.findFirst({
      where: { email: normalisedEmail, unsubscribed: true },
      select: { id: true },
    });
    if (prior) {
      return NextResponse.json({
        ok: true,
        suppressed: true,
        message:
          "This address has unsubscribed from PureWell emails. Contact support if you'd like to re-subscribe.",
      });
    }

    // Create the subscriber row first so we have an unsubscribeToken
    // to drop into the email footer.
    const subscriber = await db.subscriber.create({
      data: {
        email: normalisedEmail,
        source: type === "quiz-protocol" ? "quiz" : "recipe",
        referenceId: referenceId ?? null,
        marketingOptIn: !!marketingOptIn,
      },
    });
    const unsubscribeUrl = `${SITE_URL}/api/email/unsubscribe?token=${subscriber.unsubscribeToken}`;

    const rendered =
      type === "quiz-protocol"
        ? renderProtocolEmail(payload as ProtocolEmailPayload, unsubscribeUrl)
        : renderRecipeEmail(payload as RecipeEmailPayload, unsubscribeUrl);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: normalisedEmail,
        subject: rendered.subject,
        html: rendered.html,
      }),
    });

    if (!resendRes.ok) {
      // Try to surface the underlying message — Resend returns
      // structured JSON for 4xx (bad domain, unverified address, etc.)
      let detail = "";
      try {
        const j = await resendRes.json();
        detail = j?.message || j?.error || JSON.stringify(j);
      } catch {
        detail = await resendRes.text();
      }
      console.error("Resend send failed:", resendRes.status, detail);
      return NextResponse.json(
        { error: "Couldn't send the email. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { error: "Couldn't send the email. Please try again later." },
      { status: 500 },
    );
  }
}

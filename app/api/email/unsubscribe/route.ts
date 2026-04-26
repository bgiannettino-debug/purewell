import { NextRequest } from "next/server";
import { db } from "../../../../lib/db";

// GET /api/email/unsubscribe?token=<unsubscribeToken>
//
// Hit by the link at the bottom of every email we send. Marks every
// Subscriber row sharing that email as unsubscribed (so a future
// /api/email/send for the same address is suppressed across sources).
//
// Returns a small confirmation HTML page so users see something
// reassuring after clicking — not raw JSON. No CSRF concerns: the
// token is per-row and only enables a destructive-but-reversible
// preference flip, not access to anything sensitive.

export const dynamic = "force-dynamic";

const html = (title: string, body: string) => new Response(
  `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
    <style>
      body { margin:0; padding:0; background:#faf8f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#2d2a24; }
      .wrap { max-width: 480px; margin: 80px auto; padding: 32px 24px; text-align: center; }
      .card { background:#fff; border:1px solid #e7e3dc; border-radius:14px; padding:32px 24px; }
      h1 { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
      p { font-size: 14px; color: #6b6560; line-height: 1.6; margin: 0 0 20px; }
      a { display: inline-block; background: #3d6b4f; color: #fff; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 10px; text-decoration: none; }
      .brand { font-size: 18px; font-weight: 700; margin-bottom: 14px; }
      .brand .green { color: #3d6b4f; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="brand">pure<span class="green">well</span></div>
      <div class="card">
        ${body}
      </div>
    </div>
  </body>
</html>`,
  { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return html("Invalid unsubscribe link", `
      <h1>Invalid link</h1>
      <p>This unsubscribe link is missing a token. Please use the link from your most recent email.</p>
      <a href="https://purewellnatural.com">Visit PureWell</a>
    `);
  }

  try {
    const row = await db.subscriber.findUnique({ where: { unsubscribeToken: token } });
    if (!row) {
      return html("Link expired", `
        <h1>Link expired or already used</h1>
        <p>If you're still receiving emails you don't want, click the unsubscribe link in the most recent one or contact us.</p>
        <a href="https://purewellnatural.com">Visit PureWell</a>
      `);
    }

    // Mark every row for this address as unsubscribed so a re-opt-in
    // through a different source still respects the user's choice.
    await db.subscriber.updateMany({
      where: { email: row.email },
      data: { unsubscribed: true },
    });

    return html("You've been unsubscribed", `
      <h1>You've been unsubscribed</h1>
      <p>We won't email <strong>${row.email}</strong> again. If this was a mistake, you can always opt in again from the quiz or recipe pages.</p>
      <a href="https://purewellnatural.com">Visit PureWell</a>
    `);
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return html("Something went wrong", `
      <h1>Something went wrong</h1>
      <p>Please try the link again, or contact us if the problem persists.</p>
      <a href="https://purewellnatural.com">Visit PureWell</a>
    `);
  }
}

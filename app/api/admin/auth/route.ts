import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deriveSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "../../../../lib/adminAuth";

// POST /api/admin/auth — login. Compares submitted password to
// ADMIN_PASSWORD; on match, sets the session cookie to the
// HMAC-derived token from lib/adminAuth.ts. Rotating ADMIN_PASSWORD
// changes the derived token and invalidates every open session.

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD) {
    // Misconfiguration on the server. Don't pretend things are fine.
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, deriveSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: lax is the right default for an admin login form
    // submitted via fetch from the same origin — strict would also
    // work but blocks cross-site navigation back into /admin in a
    // way that's occasionally annoying.
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/auth — logout. Clears the cookie. Not strictly
// required (the client could just stop sending it), but having an
// explicit logout endpoint is useful for the admin UI and makes the
// "invalidate this session" intent clear in the audit log.
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Admin auth helpers. The session cookie value is an HMAC-SHA256 of a
// fixed app-specific string keyed by ADMIN_PASSWORD — so the cookie's
// value is fully determined by the env var. Rotating ADMIN_PASSWORD
// changes the derived token, which automatically invalidates every
// open admin session without any explicit "log everyone out" action
// (or a session-store migration).
//
// Why HMAC and not just a hash of the password: HMAC keeps the password
// out of the resulting bytes (no rainbow-table attack), and the fixed
// "purewell-admin-session-v1" message lets us version the format if we
// ever need to invalidate sessions independently of password rotation
// (just bump v1 → v2 in code).

export const SESSION_COOKIE_NAME = "admin_session";

// 24 hours in seconds. Same as the previous implementation. Bumping
// this longer would be more convenient but also gives a stolen cookie
// a longer life, so leave at a day for now.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

/**
 * Compute the canonical session token for the *currently configured*
 * admin password. Throws if ADMIN_PASSWORD isn't set — that's a config
 * error and we'd rather fail loudly than authenticate against an empty
 * key (which would let any cookie value match).
 */
export function deriveSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  return createHmac("sha256", password)
    .update("purewell-admin-session-v1")
    .digest("hex");
}

/**
 * Constant-time comparison so we don't leak password info via timing
 * differences on the cookie check. Both inputs must be hex strings of
 * equal length — which they are when both are produced by HMAC-SHA256.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/**
 * Returns true iff the request carries a valid admin_session cookie
 * matching the current ADMIN_PASSWORD-derived token. Used by every
 * protected admin API route — the previous implementation duplicated
 * this same check three places with a static "authenticated" string.
 */
export async function isAuthenticated(): Promise<boolean> {
  let expected: string;
  try {
    expected = deriveSessionToken();
  } catch {
    // If ADMIN_PASSWORD is unset, deny all auth rather than allow.
    return false;
  }
  const cookieStore = await cookies();
  const got = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!got) return false;
  return safeEqual(got, expected);
}

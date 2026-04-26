"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Shared top bar for every page under /admin. Centralizes the logo,
// "View store" escape hatch, and a Log out button that hits the
// session-deleting DELETE endpoint we added in /api/admin/auth.
//
// Previously each admin page (products list, new, edit, import) had
// its own inline copy of this header — keeping the styling in sync
// was already getting tedious before adding a logout button. One
// component now means one place to add future actions (settings,
// theme, account menu, etc.).
//
// `back` lets sub-pages (new, edit, import) replace the default
// "View store ↗" with a "← Back to <wherever>" link. When omitted,
// we fall back to the storefront link.

type Props = {
  back?: { href: string; label: string };
};

export default function AdminNav({ back }: Props = {}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // DELETE /api/admin/auth clears the admin_session cookie. The
      // server response success isn't strictly required for the UX —
      // even if the request fails, we route to /admin so the user
      // sees the login screen and can re-authenticate.
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Swallow — we're navigating regardless.
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ width: "28px", height: "28px", background: "#3d6b4f", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white" />
        </svg>
      </div>
      <span style={{ fontSize: "15px", fontWeight: 600, color: "#2d2a24" }}>
        pure<span style={{ color: "#3d6b4f" }}>well</span>
        <span style={{ fontSize: "12px", color: "#9c9488", fontWeight: 400, marginLeft: "6px" }}>
          Admin
        </span>
      </span>
      <div style={{ flex: 1 }} />
      <Link
        href={back?.href ?? "/"}
        style={{ fontSize: "13px", color: "#6b6560", textDecoration: "none" }}
      >
        {back?.label ?? "View store ↗"}
      </Link>
      {/* Vertical divider so View store and Log out read as siblings
          rather than one bleeding into the other. */}
      <div style={{ width: "1px", height: "16px", background: "#e7e3dc" }} aria-hidden />
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{
          fontSize: "13px",
          color: "#6b6560",
          background: "none",
          border: "none",
          cursor: loggingOut ? "wait" : "pointer",
          padding: 0,
          fontWeight: 500,
        }}
      >
        {loggingOut ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}

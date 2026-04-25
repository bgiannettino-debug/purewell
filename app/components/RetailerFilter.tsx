"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "purewell-retailers";

const RETAILERS = [
  { id: "amazon", label: "Amazon" },
  { id: "iherb", label: "iHerb" },
  { id: "thrive", label: "Thrive Market" },
  { id: "other", label: "Other retailers" },
];

type Props = {
  activeRetailers: string[];
};

export default function RetailerFilter({ activeRetailers }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [savedHint, setSavedHint] = useState(false);
  const hasSyncedFromStorage = useRef(false);

  // On first mount: if the URL has no retailers param but the user has a
  // saved preference in localStorage, push it into the URL so the server-side
  // filter applies. Mirrors how a logged-in account would carry the choice.
  useEffect(() => {
    if (hasSyncedFromStorage.current) return;
    hasSyncedFromStorage.current = true;
    if (typeof window === "undefined") return;
    if (searchParams.has("retailers")) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length === 0) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("retailers", arr.join(","));
      router.replace(`${pathname}?${params.toString()}`);
    } catch (e) {
      console.warn("Could not read saved retailer preference", e);
    }
  }, [pathname, router, searchParams]);

  const toggle = (id: string) => {
    const next = activeRetailers.includes(id)
      ? activeRetailers.filter((r) => r !== id)
      : [...activeRetailers, id];

    // Persist as the standing preference.
    try {
      if (next.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch (e) {
      console.warn("Could not save retailer preference", e);
    }

    // Show a small "Saved" hint the first time the user picks something in
    // this session so it's clear it's persisted, not just a one-off filter.
    if (next.length > 0) {
      setSavedHint(true);
      window.setTimeout(() => setSavedHint(false), 2000);
    }

    // Drive the URL so the server re-renders the filtered grid.
    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("retailers");
    } else {
      params.set("retailers", next.join(","));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="retailer-filter" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      <div
        className="retailer-filter-label"
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: "#9c9488",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
        }}
      >
        Shop from
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {RETAILERS.map((r) => {
          const selected = activeRetailers.includes(r.id);
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              style={{
                padding: "5px 12px",
                borderRadius: "99px",
                fontSize: "12px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                cursor: "pointer",
                border: selected ? "1px solid #3d6b4f" : "1px solid #e7e3dc",
                background: selected ? "#eef5f0" : "#fff",
                color: selected ? "#3d6b4f" : "#6b6560",
                transition: "all 0.15s",
              }}
            >
              {selected ? "✓ " : ""}
              {r.label}
            </button>
          );
        })}
        {activeRetailers.length > 0 && (
          <button
            onClick={() => {
              try {
                localStorage.removeItem(STORAGE_KEY);
              } catch {}
              const params = new URLSearchParams(searchParams.toString());
              params.delete("retailers");
              const qs = params.toString();
              router.push(qs ? `${pathname}?${qs}` : pathname);
            }}
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              color: "#9c9488",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Clear preference
          </button>
        )}
        {savedHint && (
          <span
            style={{
              fontSize: "11px",
              color: "#3d6b4f",
              background: "#eef5f0",
              border: "1px solid #c8ddd0",
              padding: "1px 8px",
              borderRadius: "99px",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            ✓ Saved as your preference
          </span>
        )}
      </div>
    </div>
  );
}

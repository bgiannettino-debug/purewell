"use client";

import { useSearchParams } from "next/navigation";
import { useFilterDrawer } from "../../lib/filterDrawerStore";

// "Filters" button that sits in the navbar's right action cluster.
// Mirrors the cart button visually (same dark pill shape, same green
// count badge) so they read as a sibling pair. Clicking opens the
// FilterDrawer via the shared Zustand store.
//
// Active filter count comes from URL search params:
//   - category present and not "all" → +1
//   - retailers param non-empty → + (number of retailers)
//   - certs param non-empty → + (number of certs)
// Search isn't counted here since it has its own visible input.

export default function FilterButton() {
  const open = useFilterDrawer((s) => s.open);
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const retailers = searchParams.get("retailers");
  const certs = searchParams.get("certs");

  const activeCount =
    (category && category !== "all" ? 1 : 0) +
    (retailers ? retailers.split(",").filter(Boolean).length : 0) +
    (certs ? certs.split(",").filter(Boolean).length : 0);

  return (
    <button
      onClick={open}
      aria-label="Open filters"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "#2d2a24",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 500,
        padding: "8px 14px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
      }}
    >
      {/* Funnel/filter icon. Tiny SVG so we don't pull in lucide-react
          or another icon dep just for this. */}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 2h12l-4.5 6v4l-3 1V8L1 2z" />
      </svg>
      <span className="filter-btn-label">Filters</span>
      {activeCount > 0 && (
        <span
          style={{
            background: "#3d6b4f",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {activeCount}
        </span>
      )}
    </button>
  );
}

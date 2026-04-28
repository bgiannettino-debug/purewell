"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Multi-select chip filter for product certifications. Same UX shape
// as RetailerFilter (toggle on click, ✓ prefix when selected, URL-
// driven state) but with per-chip counts so the user can see how
// many products carry each cert in the current category/retailer/
// search context. Chips with a zero count are dimmed and disabled
// rather than hidden — that way the user knows the option exists
// but isn't reachable from where they are.
//
// Filter logic is AND, applied server-side via Prisma's hasEvery:
// picking Vegan + Gluten-free returns only products carrying BOTH.
//
// Counts are computed in the page server component from the
// pre-cert-filter pool, so toggling certs doesn't make the count of
// OTHER certs jitter — they always reflect "how many products in
// the current category/retailer slice carry this cert".

const CERTS: { id: string; label: string }[] = [
  { id: "USDA Organic", label: "Organic" },
  { id: "Non-GMO", label: "Non-GMO" },
  { id: "Vegan", label: "Vegan" },
  { id: "Gluten-free", label: "Gluten-free" },
  { id: "Third-party tested", label: "Third-party tested" },
  { id: "GMP Certified", label: "GMP Certified" },
  { id: "Kosher", label: "Kosher" },
  { id: "Fair Trade", label: "Fair Trade" },
];

type Props = {
  activeCerts: string[];
  // Map of cert id → count of matching products in the current
  // (cert-less) filter context. Zero-count chips render dimmed.
  certCounts: Record<string, number>;
};

export default function CertFilter({ activeCerts, certCounts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const toggle = (id: string) => {
    const next = activeCerts.includes(id)
      ? activeCerts.filter((c) => c !== id)
      : [...activeCerts, id];

    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("certs");
    } else {
      params.set("certs", next.join(","));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div
      className="cert-filter"
      style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}
    >
      {/* Inline 'Certified' label removed — the FilterDrawer renders
          its own section header above this component. */}
      <div className="cert-chips" style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {CERTS.map((c) => {
          const selected = activeCerts.includes(c.id);
          const count = certCounts[c.id] ?? 0;
          const empty = count === 0 && !selected;
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              disabled={empty}
              style={{
                padding: "5px 10px",
                borderRadius: "99px",
                fontSize: "12px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: empty ? "not-allowed" : "pointer",
                border: selected ? "1px solid #3d6b4f" : "1px solid #e7e3dc",
                background: selected ? "#eef5f0" : empty ? "#faf8f5" : "#fff",
                color: selected ? "#3d6b4f" : empty ? "#c5bfb5" : "#6b6560",
                opacity: empty ? 0.6 : 1,
                transition: "all 0.15s",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {selected ? "✓ " : ""}
              {c.label}
              <span style={{ fontSize: "10px", opacity: 0.7, fontWeight: 600 }}>
                {count}
              </span>
            </button>
          );
        })}
        {activeCerts.length > 0 && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("certs");
              const qs = params.toString();
              router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

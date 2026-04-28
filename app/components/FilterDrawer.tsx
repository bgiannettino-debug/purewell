"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useFilterDrawer } from "../../lib/filterDrawerStore";
import CategoryFilter from "./CategoryFilter";
import RetailerFilter from "./RetailerFilter";
import CertFilter from "./CertFilter";

// Left-side filter drawer. Mirrors the cart sidebar's right-side
// pattern (same width clamp, same overlay, same slide animation)
// so the two drawers feel like a matched pair.
//
// Holds the three existing filter components vertically — they each
// already drive their own URL state, so changes apply instantly and
// the products grid behind the drawer updates in real-time. No
// "Apply" button needed.

type Category = { id: string; label: string };

type Props = {
  categories: Category[];
  activeCategory: string;
  activeRetailers: string[];
  activeCerts: string[];
  certCounts: Record<string, number>;
  // True if there are any cert-eligible products at all in the
  // current category/retailer/search slice. Hides the cert section
  // when there's nothing to show, matching the existing homepage
  // behavior.
  hasCerts: boolean;
};

export default function FilterDrawer({
  categories,
  activeCategory,
  activeRetailers,
  activeCerts,
  certCounts,
  hasCerts,
}: Props) {
  const isOpen = useFilterDrawer((s) => s.isOpen);
  const close = useFilterDrawer((s) => s.close);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lock body scroll while the drawer is open so the page underneath
  // doesn't slide around when the user scrolls inside the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape key. Reaches for keyboard users without forcing
  // them to find the X button.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const totalActive =
    (activeCategory && activeCategory !== "all" ? 1 : 0) +
    activeRetailers.length +
    activeCerts.length;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("retailers");
    params.delete("certs");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      {/* Backdrop overlay — click to close. */}
      {isOpen && (
        <div
          onClick={close}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }}
          aria-hidden
        />
      )}

      {/* Drawer panel. Sliding from the LEFT mirrors the cart sidebar
          which slides from the right. Width clamps to viewport on
          narrow phones (< 380px the static 380px would overflow). */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "min(380px, 100vw)",
          maxWidth: "100vw",
          background: "#fff",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #e7e3dc",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid #e7e3dc",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#2d2a24" }}>
            Filters {totalActive > 0 && <span style={{ color: "#9c9488", fontWeight: 400 }}>({totalActive})</span>}
          </div>
          <button
            onClick={close}
            aria-label="Close filters"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9c9488", fontSize: "18px", padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Content — scrolls if filters get long. The drawer-filters
            class lets globals.css restyle the chip clusters as a
            stacked vertical list (instead of the default horizontal
            scrolling row), since wider stacked rows read better in
            a drawer's narrow column. */}
        <div className="drawer-filters" style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Category section */}
          <section style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#9c9488",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
              }}
            >
              Category
            </div>
            <CategoryFilter categories={categories} activeCategory={activeCategory} />
          </section>

          {/* Retailer section */}
          <section style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#9c9488",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
              }}
            >
              Shop from
            </div>
            <RetailerFilter activeRetailers={activeRetailers} />
          </section>

          {/* Cert section */}
          {hasCerts && (
            <section style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9c9488",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "10px",
                }}
              >
                Certified
              </div>
              <CertFilter activeCerts={activeCerts} certCounts={certCounts} />
            </section>
          )}
        </div>

        {/* Footer — Clear all + Done. Done is just a confirm-and-close
            since changes apply instantly; user can also tap the X
            or the backdrop. */}
        <div style={{ display: "flex", gap: "8px", padding: "14px 20px", borderTop: "1px solid #e7e3dc", background: "#faf8f5" }}>
          <button
            onClick={clearAll}
            disabled={totalActive === 0}
            style={{
              flex: 1,
              background: "#fff",
              color: totalActive === 0 ? "#c5bfb5" : "#6b6560",
              fontSize: "13px",
              fontWeight: 500,
              padding: "11px",
              borderRadius: "10px",
              border: "1px solid #e7e3dc",
              cursor: totalActive === 0 ? "not-allowed" : "pointer",
            }}
          >
            Clear all
          </button>
          <button
            onClick={close}
            style={{
              flex: 1,
              background: "#3d6b4f",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              padding: "11px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            See results
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { useCart } from "../../lib/cartStore";

// Per-product action group — primary "Buy on <Retailer> →" button
// that opens the affiliate URL in a new tab (and silently stages the
// item in the cart for repeat purchases), plus a small secondary "+"
// button for users staging multiple items into the multi-retailer
// cart flow.
//
// Why both:
// - One-item shoppers click Buy → directly into Amazon, the
//   Associates 24-hour cookie window opens, conversion path is clean.
//   Affiliate sales are typically single-item, so this is the high-
//   conversion default path.
// - Multi-item / multi-retailer planners click + to stage products
//   into the cart, then bulk-check out via the cart sidebar's
//   per-supplier checkout buttons.

const SUPPLIER_LABELS: Record<string, string> = {
  amazon: "Amazon",
  iherb: "iHerb",
  thrive: "Thrive",
  other: "retailer",
};

type Props = {
  affiliateUrl: string | null;
  supplier?: string;
  asin?: string | null;
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  slug: string;
  // Compact rendering for narrow contexts (e.g. cart sidebar previews).
  // Currently unused but kept on the type so existing call sites
  // pass it through without TS errors.
  fullWidth?: boolean;
};

export default function BuyNowButton({
  affiliateUrl,
  supplier = "amazon",
  asin = null,
  id,
  name,
  brand,
  price,
  imageUrl,
  slug,
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const supplierName = SUPPLIER_LABELS[supplier] ?? "retailer";

  // Direct buy: opens affiliate URL in a new tab and silently records
  // the item in the cart so repeat-purchase flows still work. Silent
  // mode skips popping the cart sidebar — focus stays on the retailer
  // tab the user just opened.
  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (affiliateUrl) {
      window.open(affiliateUrl, "_blank", "noopener,noreferrer");
    }
    addItem(
      { id, name, brand, price, imageUrl, slug, affiliateUrl, supplier, asin },
      { silent: true },
    );
  };

  // Add-only: stages the item and pops the cart sidebar. For users
  // building a multi-item or multi-retailer order before checkout.
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, brand, price, imageUrl, slug, affiliateUrl, supplier, asin });
  };

  // If we don't have an affiliate URL there's nothing to "Buy" against
  // — degrade gracefully to the old single-button add-to-cart UX.
  if (!affiliateUrl) {
    return (
      <button
        onClick={handleAdd}
        style={{
          background: "#3d6b4f",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 600,
          padding: "6px 12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Add to cart
      </button>
    );
  }

  return (
    // Action row. Two buttons on desktop (Buy + Add), collapsed to
    // just Buy on narrow mobile cards (the 2-col product grid leaves
    // ~140px per card which can't fit both). Supplier name hidden on
    // small screens to keep the Buy button compact — see the rules
    // in app/globals.css under .buy-now-row.
    <div className="buy-now-row" style={{ display: "flex", gap: "6px", alignItems: "stretch" }}>
      <button
        onClick={handleBuy}
        title={`Buy on ${supplierName} (opens ${supplierName} in a new tab)`}
        className="buy-now-btn"
        style={{
          background: "#3d6b4f",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 600,
          padding: "6px 10px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          lineHeight: 1.3,
        }}
      >
        Buy<span className="buy-now-supplier"> on {supplierName}</span> →
      </button>
      <button
        onClick={handleAdd}
        aria-label="Add to PureWell cart"
        title="Add to cart for multi-item checkout"
        className="buy-now-add"
        style={{
          background: "#fff",
          color: "#3d6b4f",
          fontWeight: 700,
          padding: "0 10px",
          borderRadius: "8px",
          border: "1px solid #c8ddd0",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
        }}
      >
        +
      </button>
    </div>
  );
}

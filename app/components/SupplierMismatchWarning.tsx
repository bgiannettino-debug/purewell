"use client";

import {
  detectSupplierFromUrl,
  supplierLabels,
  type SupplierId,
} from "../../lib/supplierFromUrl";

type Props = {
  affiliateUrl: string;
  supplier: string;
  onFix: (supplier: SupplierId) => void;
};

/**
 * Renders a small inline warning when the supplier dropdown disagrees with
 * the host of the affiliate URL — and offers a one-click fix. Returns null
 * (no UI) when the URL is empty, unparseable, or already matches.
 *
 * Why: the products grid filter and the cart's per-retailer grouping both
 * read the `supplier` field directly, not the URL. Drift between them is a
 * silent bug, so we surface it at edit time.
 */
export default function SupplierMismatchWarning({
  affiliateUrl,
  supplier,
  onFix,
}: Props) {
  const detected = detectSupplierFromUrl(affiliateUrl);
  if (!detected) return null;
  if (detected === supplier) return null;

  const currentLabel =
    supplierLabels[supplier as SupplierId] || supplier || "(none)";
  const detectedLabel = supplierLabels[detected];

  return (
    <div
      style={{
        background: "#fef6e7",
        border: "1px solid #f0d4a0",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        color: "#8a6020",
        lineHeight: "1.5",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        marginTop: "8px",
      }}
    >
      <span style={{ flexShrink: 0, fontSize: "14px", lineHeight: 1 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div>
          The affiliate URL host looks like{" "}
          <strong style={{ color: "#5c3f10" }}>{detectedLabel}</strong>, but
          supplier is set to{" "}
          <strong style={{ color: "#5c3f10" }}>{currentLabel}</strong>. The
          products filter and the cart grouping use the supplier field, not the
          URL.
        </div>
        <button
          type="button"
          onClick={() => onFix(detected)}
          style={{
            marginTop: "6px",
            background: "#fff",
            color: "#8a6020",
            border: "1px solid #f0d4a0",
            borderRadius: "8px",
            padding: "4px 10px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Set supplier to {detectedLabel}
        </button>
      </div>
    </div>
  );
}

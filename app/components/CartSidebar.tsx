"use client";

import { useCart } from "../../lib/cartStore";
import Image from "next/image";
import { useEffect, useState } from "react";

const AMAZON_TAG = "purewell0d-20"; // Replace with your Amazon Associates tag

type SupplierGroup = {
  supplier: string;
  label: string;
  items: ReturnType<typeof useCart.getState>["items"];
};

function buildAmazonCartUrl(items: SupplierGroup["items"], tag: string) {
  const params = new URLSearchParams();
  params.set("AssociateTag", tag);
  let index = 1;
  for (const item of items) {
    if (item.asin) {
      params.set(`ASIN.${index}`, item.asin);
      params.set(`Quantity.${index}`, item.qty.toString());
      index++;
    }
  }
  if (index === 1) return null; // No ASINs available
  return `https://www.amazon.com/gp/aws/cart/add.html?${params.toString()}`;
}

const supplierLabels: Record<string, string> = {
  amazon: "Amazon",
  iherb: "iHerb",
  other: "Retailer",
};

const supplierColors: Record<string, { bg: string; color: string; border: string }> = {
  amazon: { bg: "#FF9900", color: "#fff", border: "#FF9900" },
  iherb: { bg: "#7ab648", color: "#fff", border: "#7ab648" },
  other: { bg: "#3d6b4f", color: "#fff", border: "#3d6b4f" },
};

// Static per-retailer shipping hints. PureWell is affiliate-only — actual
// shipping is determined by whichever retailer fulfills the order, so we show
// their rules rather than pretending we can offer free shipping ourselves.
const supplierShippingHints: Record<string, string> = {
  amazon: "Free shipping on eligible orders $35+ · Free with Prime",
  iherb: "Free US shipping on most orders $20+",
  other: "Shipping calculated by retailer at checkout",
};

export default function CartSidebar() {
  const {
    items, removeItem, updateQty, total, count,
    isOpen, openCart, closeCart,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const groupedItems = mounted
    ? Object.values(
        items.reduce((groups, item) => {
          const key = item.supplier || "other";
          if (!groups[key]) groups[key] = { supplier: key, label: supplierLabels[key] || key, items: [] };
          groups[key].items.push(item);
          return groups;
        }, {} as Record<string, SupplierGroup>)
      )
    : [];

  const handleSupplierCheckout = (group: SupplierGroup) => {
    if (group.supplier === "amazon") {
      const cartUrl = buildAmazonCartUrl(group.items, AMAZON_TAG);
      if (cartUrl) {
        window.open(cartUrl, "_blank");
        return;
      }
      // Fallback: open each item individually
      group.items.forEach((item) => {
        if (item.affiliateUrl) window.open(item.affiliateUrl, "_blank");
      });
    } else {
      // iHerb and others: open each item in a new tab
      group.items.forEach((item) => {
        if (item.affiliateUrl) window.open(item.affiliateUrl, "_blank");
      });
    }
  };

  return (
    <>
      {/* Cart button */}
      <button
        onClick={openCart}
        style={{ display: "flex", alignItems: "center", gap: "8px", background: "#2d2a24", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1h2l1.5 7h6L12 4H4"/>
          <circle cx="5.5" cy="12" r="1"/>
          <circle cx="10" cy="12" r="1"/>
        </svg>
        Cart
        {mounted && count() > 0 && (
          <span style={{ background: "#3d6b4f", color: "#fff", fontSize: "11px", fontWeight: "700", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {count()}
          </span>
        )}
      </button>

      {/* Overlay */}
      {mounted && isOpen && (
        <div onClick={closeCart} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%", width: "420px",
        background: "#fff", zIndex: 50,
        transform: mounted && isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column",
        borderLeft: "1px solid #e7e3dc",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e7e3dc" }}>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24" }}>
            Your cart {mounted && count() > 0 && `(${count()} items)`}
          </div>
          <button onClick={closeCart} style={{ background: "none", border: "none", cursor: "pointer", color: "#9c9488", fontSize: "18px" }}>
            ✕
          </button>
        </div>

        {/* Empty state */}
        {!mounted || items.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9c9488" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌿</div>
            <div style={{ fontSize: "14px", marginBottom: "16px" }}>Your cart is empty</div>
            <button
              onClick={closeCart}
              style={{ fontSize: "13px", color: "#3d6b4f", background: "#eef5f0", border: "1px solid #c8ddd0", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Grouped items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {groupedItems.map((group) => {
                const colors = supplierColors[group.supplier] || supplierColors.other;
                return (
                  <div key={group.supplier} style={{ marginBottom: "20px" }}>
                    {/* Supplier header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.bg }} />
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#2d2a24" }}>
                          {group.label}
                        </span>
                        <span style={{ fontSize: "11px", color: "#9c9488" }}>
                          ({group.items.length} item{group.items.length > 1 ? "s" : ""})
                        </span>
                      </div>
                    </div>

                    {/* Items in this group */}
                    <div style={{ background: "#faf8f5", borderRadius: "12px", padding: "12px", marginBottom: "10px" }}>
                      {group.items.map((item) => (
                        <div key={item.id} style={{ display: "flex", gap: "10px", marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #f0ece6" }}>
                          <div style={{ position: "relative", width: "52px", height: "52px", background: "#fff", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #e7e3dc" }}>
                            {item.imageUrl && (
                              <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: "600", color: "#2d2a24", marginBottom: "2px", lineHeight: "1.3" }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "6px" }}>{item.brand}</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7e3dc", borderRadius: "6px", overflow: "hidden", background: "#fff" }}>
                                <button
                                  onClick={() => item.qty === 1 ? removeItem(item.id) : updateQty(item.id, item.qty - 1)}
                                  style={{ width: "24px", height: "24px", background: "none", border: "none", cursor: "pointer", color: "#6b6560", fontSize: "13px" }}
                                >
                                  −
                                </button>
                                <span style={{ width: "24px", textAlign: "center", fontSize: "12px", fontWeight: "500", color: "#2d2a24" }}>
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                  style={{ width: "24px", height: "24px", background: "none", border: "none", cursor: "pointer", color: "#6b6560", fontSize: "13px" }}
                                >
                                  +
                                </button>
                              </div>
                              <div style={{ fontSize: "13px", fontWeight: "700", color: "#2d2a24" }}>
                                ${(item.price * item.qty).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#c5bfb5", fontSize: "14px", alignSelf: "flex-start", padding: "0" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Shipping hint for this supplier */}
                    {supplierShippingHints[group.supplier] && (
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "8px", lineHeight: "1.5" }}>
                        {supplierShippingHints[group.supplier]}
                      </div>
                    )}

                    {/* Checkout button for this supplier */}
                    <button
                      onClick={() => handleSupplierCheckout(group)}
                      style={{
                        width: "100%", background: colors.bg, color: colors.color,
                        fontSize: "13px", fontWeight: "600", padding: "11px",
                        borderRadius: "10px", border: "none", cursor: "pointer",
                      }}
                    >
                      Buy {group.items.length} item{group.items.length > 1 ? "s" : ""} on {group.label} →
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #e7e3dc", background: "#faf8f5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px", color: "#6b6560" }}>Subtotal across retailers</span>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#2d2a24" }}>
                  ${total().toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "12px", lineHeight: "1.5" }}>
                You&apos;ll check out with each retailer separately. Final price and shipping confirmed by the retailer.
              </div>

              <div style={{ fontSize: "11px", color: "#9c9488", textAlign: "center", marginBottom: "12px", lineHeight: "1.5" }}>
                PureWell earns a small commission at no extra cost to you.
              </div>

              <button
                onClick={closeCart}
                style={{ width: "100%", background: "#fff", color: "#6b6560", fontSize: "13px", fontWeight: "500", padding: "11px", borderRadius: "12px", border: "1px solid #e7e3dc", cursor: "pointer" }}
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
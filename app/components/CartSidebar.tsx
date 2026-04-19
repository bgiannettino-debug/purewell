"use client";

import { useCart } from "../../lib/cartStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const {
    items,
    removeItem,
    updateQty,
    total,
    count,
    isOpen,
    openCart,
    closeCart,
    clearCart,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleCheckout = async () => {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Something went wrong. Please try again.");
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
        <div
          onClick={closeCart}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "400px",
        background: "#fff",
        zIndex: 50,
        transform: mounted && isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #e7e3dc",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e7e3dc" }}>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24" }}>
            Your cart {mounted && count() > 0 && `(${count()} items)`}
          </div>
          <button
            onClick={closeCart}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9c9488", fontSize: "18px", lineHeight: 1 }}
          >
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
            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0ece6" }}>
                  <div style={{ position: "relative", width: "64px", height: "64px", background: "#f5f2ed", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "2px" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "8px" }}>
                      {item.brand}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7e3dc", borderRadius: "8px", overflow: "hidden" }}>
                        <button
                          onClick={() => item.qty === 1 ? removeItem(item.id) : updateQty(item.id, item.qty - 1)}
                          style={{ width: "28px", height: "28px", background: "#faf8f5", border: "none", cursor: "pointer", color: "#6b6560", fontSize: "14px" }}
                        >
                          −
                        </button>
                        <span style={{ width: "32px", textAlign: "center", fontSize: "13px", fontWeight: "500", color: "#2d2a24" }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          style={{ width: "28px", height: "28px", background: "#faf8f5", border: "none", cursor: "pointer", color: "#6b6560", fontSize: "14px" }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#2d2a24" }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #e7e3dc", background: "#faf8f5" }}>
              {/* Free shipping progress */}
              {total() < 35 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#6b6560", marginBottom: "6px" }}>
                    Add <strong style={{ color: "#3d6b4f" }}>${(35 - total()).toFixed(2)}</strong> more for free shipping
                  </div>
                  <div style={{ height: "4px", background: "#e7e3dc", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#3d6b4f", borderRadius: "2px", width: `${Math.min((total() / 35) * 100, 100)}%`, transition: "width 0.3s" }} />
                  </div>
                </div>
              )}
              {total() >= 35 && (
                <div style={{ fontSize: "12px", color: "#3d6b4f", fontWeight: "500", marginBottom: "12px", textAlign: "center" }}>
                  🎉 You qualify for free shipping!
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", color: "#6b6560" }}>Subtotal</span>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#2d2a24" }}>
                  ${total().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                style={{ width: "100%", background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer", marginBottom: "8px" }}
              >
                Checkout →
              </button>
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
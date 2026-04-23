"use client";

import { useCart } from "../../lib/cartStore";

type Props = {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  slug: string;
  affiliateUrl?: string | null;
  supplier?: string;
  asin?: string | null;
  fullWidth?: boolean;
};

export default function AddToCartButton(props: Props) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        addItem({
          id: props.id,
          name: props.name,
          brand: props.brand,
          price: props.price,
          imageUrl: props.imageUrl,
          slug: props.slug,
          affiliateUrl: props.affiliateUrl || null,
          supplier: props.supplier || "amazon",
          asin: props.asin || null,
        });
      }}
      style={{
        background: "#3d6b4f",
        color: "#fff",
        fontSize: props.fullWidth ? "14px" : "12px",
        fontWeight: "600",
        padding: props.fullWidth ? "13px 24px" : "6px 12px",
        borderRadius: props.fullWidth ? "12px" : "8px",
        border: "none",
        cursor: "pointer",
        width: props.fullWidth ? "100%" : "auto",
        whiteSpace: "nowrap" as const,
      }}
    >
      {props.fullWidth ? "Add to cart" : "Add"}
    </button>
  );
}
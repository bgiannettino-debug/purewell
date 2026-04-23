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
};

export default function AddToCartSmall(props: Props) {
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
      style={{ background: "#3d6b4f", color: "#fff", fontSize: "12px", fontWeight: "500", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
    >
      Add
    </button>
  );
}
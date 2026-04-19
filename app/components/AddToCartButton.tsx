"use client";

import { useCart } from "../../lib/cartStore";

type Props = {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  slug: string;
};

export default function AddToCartButton(props: Props) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        addItem(props);
      }}
      style={{ background: "#3d6b4f", color: "#fff", fontSize: "12px", fontWeight: "500", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}
    >
      Add
    </button>
  );
}
"use client";

import { useCart } from "../../lib/cartStore";

type Props = {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  slug: string;
  fullWidth?: boolean;
};

export default function AddToCartButton(props: Props) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        addItem(props);
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
      }}
    >
      {props.fullWidth ? "Add to cart" : "Add"}
    </button>
  );
}
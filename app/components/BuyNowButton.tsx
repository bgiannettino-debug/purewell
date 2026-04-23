"use client";

import { useCart } from "../../lib/cartStore";

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
  fullWidth?: boolean;
};

export default function BuyNowButton({
  affiliateUrl, supplier = "amazon", asin = null,
  id, name, brand, price, imageUrl, slug, fullWidth,
}: Props) {
  const addItem = useCart((s) => s.addItem);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, brand, price, imageUrl, slug, affiliateUrl, supplier, asin });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "#3d6b4f",
        color: "#fff",
        fontSize: fullWidth ? "14px" : "12px",
        fontWeight: "600",
        padding: fullWidth ? "13px 24px" : "6px 12px",
        borderRadius: fullWidth ? "12px" : "8px",
        border: "none",
        cursor: "pointer",
        width: fullWidth ? "100%" : "auto",
        whiteSpace: "nowrap" as const,
      }}
    >
      {fullWidth ? "Add to cart" : "Add"}
    </button>
  );
}
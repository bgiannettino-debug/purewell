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
      className="bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
    >
      Add
    </button>
  );
}
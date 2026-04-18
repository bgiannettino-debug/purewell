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
      onClick={() => addItem(props)}
      className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
    >
      Add
    </button>
  );
}
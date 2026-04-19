"use client";

import { useRouter } from "next/navigation";

type Category = {
  id: string;
  label: string;
};

type Props = {
  categories: Category[];
  activeCategory: string;
};

export default function CategoryFilter({ categories, activeCategory }: Props) {
  const router = useRouter();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() =>
            router.push(cat.id === "all" ? "/" : `/?category=${cat.id}`)
          }
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === cat.id
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
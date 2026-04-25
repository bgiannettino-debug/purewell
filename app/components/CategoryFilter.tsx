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
    <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() =>
            // scroll: false keeps the user where they are when filtering;
            // default Next.js behavior would jump them back to the top.
            router.push(cat.id === "all" ? "/" : `/?category=${cat.id}`, {
              scroll: false,
            })
          }
          style={{
            padding: "5px 12px",
            borderRadius: "99px",
            fontSize: "12px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            cursor: "pointer",
            border: "none",
            background: activeCategory === cat.id ? "#3d6b4f" : "#f0ece6",
            color: activeCategory === cat.id ? "#fff" : "#6b6560",
            transition: "all 0.15s",
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
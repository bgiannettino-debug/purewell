"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: string;
  label: string;
};

type Props = {
  categories: Category[];
  activeCategories: string[];
};

// Multi-select category filter. URL state is the comma-separated
// `category` param (backward-compatible — a single value like
// ?category=supplements still works as before, it just lives in a
// one-element array internally now). The "all" pseudo-category
// represents the empty selection — clicking it clears all category
// filters.
export default function CategoryFilter({ categories, activeCategories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // "All products" is a synthetic option that means "no category
  // filter applied". Render it selected when no real categories
  // are active.
  const allSelected = activeCategories.length === 0;

  const toggle = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      // Clicking "All" wipes the category filter entirely.
      params.delete("category");
    } else {
      const next = activeCategories.includes(id)
        ? activeCategories.filter((c) => c !== id)
        : [...activeCategories, id];
      if (next.length === 0) {
        params.delete("category");
      } else {
        params.set("category", next.join(","));
      }
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="category-chips" style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
      {categories.map((cat) => {
        const selected =
          cat.id === "all" ? allSelected : activeCategories.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            style={{
              padding: "5px 12px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              cursor: "pointer",
              border: "none",
              background: selected ? "#3d6b4f" : "#f0ece6",
              color: selected ? "#fff" : "#6b6560",
              transition: "all 0.15s",
            }}
          >
            {cat.id !== "all" && selected ? "✓ " : ""}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

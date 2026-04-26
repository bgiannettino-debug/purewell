"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminNav from "../../components/AdminNav";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  certifications: string[];
  updatedAt: string; // ISO timestamp from the API
};

// Formats an ISO timestamp as a compact relative time (e.g. "2h ago",
// "5d ago"). Falls back to a date string for anything older than 30
// days. Used in the "Last edited" column so admins can see at a
// glance what's been touched recently.
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Mirrors the public site's category list (app/page.tsx) so admins
// see the same buckets shoppers do. The "all" entry is added at the
// top as a reset chip.
const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "supplements", label: "Supplements" },
  { id: "essential-oils", label: "Essential oils" },
  { id: "herbal-teas", label: "Herbal teas" },
  { id: "nutrition", label: "Nutrition" },
  { id: "skincare", label: "Skincare" },
];

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Counts per category for the chip badges. Computed once per
  // products change so chips can show "(N)" without re-filtering on
  // every render.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      // Any auth failure (cookie missing, expired, or rejected after a
      // password change) — bounce to the login page rather than trying
      // to parse a non-JSON body.
      if (res.status === 401 || res.status === 403) {
        router.push("/admin");
        return;
      }
      // Any other non-OK status is a real server error. Don't blow up
      // on res.json() (the body is usually an HTML error page); show
      // a helpful message instead.
      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to load admin products:", res.status, text);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch admin products:", err);
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <AdminNav />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "2px" }}>Products</h1>
            <p style={{ fontSize: "13px", color: "#9c9488" }}>
              {activeCategory === "all"
                ? `${products.length} products in your catalog`
                : `${filteredProducts.length} of ${products.length} products`}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              href="/admin/products/import"
              style={{ background: "#fff", color: "#3d6b4f", fontSize: "13px", fontWeight: "600", padding: "10px 18px", borderRadius: "10px", textDecoration: "none", border: "1px solid #c8ddd0" }}
            >
              Import product
            </Link>
            <Link
              href="/admin/products/new"
              style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "10px 18px", borderRadius: "10px", textDecoration: "none" }}
            >
              + Add product
            </Link>
          </div>
        </div>

        {/* Category filter chips. Disabled-looking chips for empty
            categories make it obvious there's nothing in that bucket
            without hiding the chip entirely (so admins can still see
            which sections exist on the storefront). */}
        {!loading && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] ?? 0;
              const selected = activeCategory === cat.id;
              const empty = count === 0 && cat.id !== "all";
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  disabled={empty}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "99px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: empty ? "not-allowed" : "pointer",
                    background: selected ? "#3d6b4f" : empty ? "#faf8f5" : "#fff",
                    color: selected ? "#fff" : empty ? "#c5bfb5" : "#6b6560",
                    border: `1px solid ${selected ? "#3d6b4f" : "#e7e3dc"}`,
                    opacity: empty ? 0.6 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {cat.label}
                  <span style={{ fontSize: "11px", opacity: selected ? 0.85 : 0.7, fontWeight: 600 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#9c9488" }}>Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🌿</div>
            <div style={{ fontSize: "14px", color: "#6b6560", marginBottom: "12px" }}>
              No products in this category yet.
            </div>
            <Link
              href="/admin/products/new"
              style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: 600, padding: "8px 16px", borderRadius: "10px", textDecoration: "none" }}
            >
              + Add your first
            </Link>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e7e3dc" }}>
                  {[
                    { label: "Product" },
                    { label: "Category" },
                    { label: "Price" },
                    { label: "Status" },
                    // Last-edited column hidden on mobile (table gets
                    // too wide otherwise). admin-hide-mobile rule lives
                    // in app/globals.css.
                    { label: "Last edited", className: "admin-hide-mobile" },
                    { label: "Actions" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={h.className}
                      style={{ textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 16px" }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid #f5f2ed" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ position: "relative", width: "38px", height: "38px", background: "#f5f2ed", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: "contain" }} />
                          ) : (
                            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#c5bfb5" }}>No img</div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24" }}>{product.name}</div>
                          <div style={{ fontSize: "11px", color: "#9c9488" }}>{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "11px", background: "#f5f2ed", color: "#6b6560", padding: "3px 9px", borderRadius: "99px", textTransform: "capitalize" }}>
                        {product.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#2d2a24" }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "11px", background: product.inStock ? "#eef5f0" : "#fdf0ee", color: product.inStock ? "#3d6b4f" : "#c0392b", padding: "3px 9px", borderRadius: "99px", fontWeight: "500" }}>
                        {product.inStock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="admin-hide-mobile" style={{ padding: "12px 16px" }}>
                      {/* Full timestamp on hover — relative time is
                          quick to scan but admins occasionally want
                          the precise moment something was edited. */}
                      <span
                        title={new Date(product.updatedAt).toLocaleString()}
                        style={{ fontSize: "12px", color: "#6b6560" }}
                      >
                        {relativeTime(product.updatedAt)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <Link href={`/admin/products/edit/${product.id}`} style={{ fontSize: "12px", color: "#3d6b4f", textDecoration: "none", fontWeight: "500" }}>
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id, product.name)}
                          style={{ fontSize: "12px", color: "#c0392b", background: "none", border: "none", cursor: "pointer", fontWeight: "500", padding: 0 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
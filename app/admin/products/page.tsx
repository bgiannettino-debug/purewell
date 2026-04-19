"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  certifications: string[];
};

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
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
      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "28px", height: "28px", background: "#3d6b4f", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
          </svg>
        </div>
        <span style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24" }}>
          pure<span style={{ color: "#3d6b4f" }}>well</span>
          <span style={{ fontSize: "12px", color: "#9c9488", fontWeight: "400", marginLeft: "6px" }}>Admin</span>
        </span>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{ fontSize: "13px", color: "#6b6560", textDecoration: "none" }}>
          View store ↗
        </Link>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "2px" }}>Products</h1>
            <p style={{ fontSize: "13px", color: "#9c9488" }}>{products.length} products in your catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "10px 18px", borderRadius: "10px", textDecoration: "none" }}
          >
            + Add product
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#9c9488" }}>Loading products...</div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e7e3dc" }}>
                  {["Product", "Category", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 16px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid #f5f2ed" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ position: "relative", width: "38px", height: "38px", background: "#f5f2ed", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: "cover" }} />
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
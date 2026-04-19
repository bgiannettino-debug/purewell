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
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <div className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
          <span className="text-sm text-gray-400 font-normal ml-2">
            Admin
          </span>
        </div>
        <div className="flex-1" />
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          View store
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {products.length} products in your catalog
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            + Add product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading products...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            position: "relative",
                            width: "40px",
                            height: "40px",
                          }}
                          className="bg-emerald-50 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-emerald-300 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.inStock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-xs text-emerald-600 hover:text-emerald-700"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            deleteProduct(product.id, product.name)
                          }
                          className="text-xs text-red-500 hover:text-red-600"
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
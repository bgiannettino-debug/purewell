"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const categories = [
  "supplements",
  "essential-oils",
  "herbal-teas",
  "skincare",
  "nutrition",
  "fitness",
];

const certificationOptions = [
  "USDA Organic",
  "Non-GMO",
  "Vegan",
  "Gluten-free",
  "GMP Certified",
  "Third-party tested",
  "Kosher",
  "Fair Trade",
];

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    slug: "",
    brand: "",
    description: "",
    price: "",
    category: "supplements",
    imageUrl: "",
    certifications: [] as string[],
    inStock: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      const product = data.products.find((p: { id: string }) => p.id === id);
      if (!product) {
        router.push("/admin/products");
        return;
      }
      setForm({
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        imageUrl: product.imageUrl || "",
        certifications: product.certifications || [],
        inStock: product.inStock,
      });
      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const toggleCert = (cert: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading product...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <div className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
          <span className="text-sm text-gray-400 font-normal ml-2">Admin</span>
        </div>
        <div className="flex-1" />
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to products
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">
          Edit product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Basic info
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Product name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                URL slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, brand: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="inStock"
                checked={form.inStock}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, inStock: e.target.checked }))
                }
                className="w-4 h-4 accent-emerald-600"
              />
              <label htmlFor="inStock" className="text-sm text-gray-600">
                In stock
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Certifications
            </div>
            <div className="grid grid-cols-2 gap-2">
              {certificationOptions.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCert(cert)}
                  className={`px-3 py-2 rounded-xl text-sm border transition-all text-left ${
                    form.certifications.includes(cert)
                      ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                      : "bg-white border-gray-200 text-gray-600 hover:border-emerald-200"
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save changes →"}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
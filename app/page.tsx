import Link from "next/link";
import Image from "next/image";
import { db } from "../lib/db";
import AddToCartButton from "./components/AddToCartButton";
import CartSidebar from "./components/CartSidebar";
import CategoryFilter from "./components/CategoryFilter";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string | null;
  certifications: string[];
  category: string;
  inStock: boolean;
  createdAt: Date;
};

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { category, search } = await searchParams;

  const products = await db.product.findMany({
    where: {
      ...(category && category !== "all" ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const categories = [
    { id: "all", label: "All products" },
    { id: "supplements", label: "Supplements" },
    { id: "essential-oils", label: "Essential oils" },
    { id: "herbal-teas", label: "Herbal teas" },
    { id: "nutrition", label: "Nutrition" },
    { id: "skincare", label: "Skincare" },
  ];

  return (
    <main>
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <div className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
        </div>
        <div className="flex-1" />
        <CartSidebar />
      </nav>

      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-8">
        <h1 className="text-2xl font-medium text-emerald-900 mb-2">
          Your natural health companion
        </h1>
        <p className="text-sm text-emerald-700 mb-5 max-w-lg">
          Shop curated all-natural products, discover homemade wellness recipes,
          and get AI-powered supplement recommendations.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/quiz"
            className="bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg inline-block hover:bg-emerald-700 transition-colors"
          >
            Take the wellness quiz →
          </Link>
          <Link
            href="/recipes"
            className="bg-white text-emerald-700 border border-emerald-200 text-sm font-medium px-5 py-2.5 rounded-lg inline-block hover:bg-emerald-50 transition-colors"
          >
            Browse recipes
          </Link>
        </div>
      </div>

      <div className="px-5 py-4 bg-white border-b border-gray-100">
        <CategoryFilter
          categories={categories}
          activeCategory={category || "all"}
        />
      </div>

      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">
            {category && category !== "all"
              ? categories.find((c) => c.id === category)?.label
              : "All products"}{" "}
            — {products.length} items
          </h2>
          <form method="GET" action="/" className="flex gap-2">
            {category && category !== "all" && (
              <input type="hidden" name="category" value={category} />
            )}
            <input
              name="search"
              defaultValue={search || ""}
              placeholder="Search products..."
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-48 bg-gray-50 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🌿</div>
            <div className="text-sm">
              No products found. Try a different search or category.
            </div>
            <Link
              href="/"
              className="text-emerald-600 text-sm mt-3 inline-block"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {products.map((product: Product) => (
              <Link href={`/products/${product.slug}`} key={product.id}>
                <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors cursor-pointer">
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "112px",
                    }}
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-emerald-50 rounded-lg text-emerald-300 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap mb-2 mt-3">
                    {product.certifications.slice(0, 2).map((cert) => (
                      <span
                        key={cert}
                        className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {product.brand}
                  </div>
                  <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <AddToCartButton
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      slug={product.slug}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
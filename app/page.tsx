import Link from "next/link";
import Image from "next/image";
import { db } from "../lib/db";
import AddToCartButton from "./components/AddToCartButton";
import CategoryFilter from "./components/CategoryFilter";
import Navbar from "./components/Navbar";

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
      <Navbar />

      {/* Hero */}
      <div
        className="px-5 py-14 border-b border-stone-200"
        style={{ background: "linear-gradient(135deg, #faf7f2 0%, #f0ebe0 50%, #e8f5ee 100%)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span>🌿</span> AI-powered natural wellness
            </div>
            <h1 className="text-4xl font-semibold text-stone-800 leading-tight mb-4">
              Your natural health<br />
              <span className="text-emerald-700">companion</span>
            </h1>
            <p className="text-stone-500 mb-6 leading-relaxed max-w-md">
              Curated all-natural supplements, homemade wellness recipes, and
              AI-powered health protocols — all in one place.
            </p>
            <div className="flex gap-3">
              <Link
                href="/quiz"
                className="bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl hover:bg-emerald-800 transition-colors"
              >
                Take the wellness quiz →
              </Link>
              <Link
                href="/recipes"
                className="bg-white text-stone-700 border border-stone-200 font-medium px-6 py-3 rounded-xl hover:bg-stone-50 transition-colors"
              >
                Browse recipes
              </Link>
            </div>
            <div className="flex gap-6 mt-8">
              <div>
                <div className="text-xl font-semibold text-stone-800">26+</div>
                <div className="text-xs text-stone-400">Natural products</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-stone-800">8</div>
                <div className="text-xs text-stone-400">Free recipes</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-stone-800">100%</div>
                <div className="text-xs text-stone-400">All natural</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["bg-emerald-50", "bg-amber-50", "bg-stone-100", "bg-emerald-100"].map((bg, i) => (
              <div
                key={i}
                className={`${bg} rounded-2xl h-32 flex items-center justify-center text-3xl`}
              >
                {["🌿", "🍯", "🌸", "🫚"][i]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-5 py-3 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto">
          <CategoryFilter
            categories={categories}
            activeCategory={category || "all"}
          />
        </div>
      </div>

      {/* Products */}
      <div className="px-5 py-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-stone-800">
              {category && category !== "all"
                ? categories.find((c) => c.id === category)?.label
                : "All products"}{" "}
              <span className="text-stone-400 font-normal text-sm">
                ({products.length} items)
              </span>
            </h2>
            <form method="GET" action="/" className="flex gap-2">
              {category && category !== "all" && (
                <input type="hidden" name="category" value={category} />
              )}
              <input
                name="search"
                defaultValue={search || ""}
                placeholder="Search..."
                className="border border-stone-200 rounded-xl px-3 py-2 text-sm w-40 bg-white focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-700 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-800 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <div className="text-4xl mb-3">🌿</div>
              <div className="text-sm">No products found.</div>
              <Link href="/" className="text-emerald-600 text-sm mt-3 inline-block">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {products.map((product: Product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group">
                    <div
                      style={{ position: "relative", width: "100%", height: "160px" }}
                      className="bg-stone-50"
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-stone-300 text-sm">
                          No image
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                        {product.certifications.slice(0, 1).map((cert) => (
                          <span
                            key={cert}
                            className="text-xs bg-white bg-opacity-90 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-100"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-stone-400 mb-1">
                        {product.brand}
                      </div>
                      <div className="text-sm font-semibold text-stone-800 mb-1 leading-tight">
                        {product.name}
                      </div>
                      <div className="text-xs text-stone-400 mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-stone-800">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
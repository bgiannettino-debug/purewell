import Link from "next/link";
import Image from "next/image";
import { db } from "../lib/db";
import AddToCartButton from "./components/AddToCartButton";
import CartSidebar from "./components/CartSidebar";

export default async function Home() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main>
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
      <div className="text-lg font-medium">
        pure<span className="text-emerald-700">well</span>
      </div>
      <div className="flex-1" />
      <input
        placeholder="Search natural products..."
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-64 bg-gray-50"
      />
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
        <button className="bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg">
          Take the wellness quiz →
        </button>
      </div>

      <div className="px-5 py-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Featured products — {products.length} items
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id}>
              <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors cursor-pointer">
                <div
                  style={{ position: "relative", width: "100%", height: "112px" }}
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
                <div className="text-xs text-gray-400 mb-1">{product.brand}</div>
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
      </div>
    </main>
  );
}
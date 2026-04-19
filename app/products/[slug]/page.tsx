import Image from "next/image";
import Link from "next/link";
import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import AddToCartButton from "../../components/AddToCartButton";
import CartSidebar from "../../components/CartSidebar";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  return (
    <main>
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
      <div className="text-lg font-medium">
        pure<span className="text-emerald-700">well</span>
      </div>
      <div className="flex-1" />
        <Link href="/" className="text-sm text-emerald-700">
            ← Back to products
        </Link>
        <CartSidebar />
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-8 grid grid-cols-2 gap-10">
        {/* Left — image */}
        <div
          style={{ position: "relative", width: "100%", height: "360px" }}
          className="bg-emerald-50 rounded-2xl overflow-hidden"
        >
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
            />
          )}
        </div>

        {/* Right — details */}
        <div>
          <div className="text-sm text-emerald-700 font-medium mb-1">
            {product.brand}
          </div>
          <h1 className="text-2xl font-medium text-gray-900 mb-3">
            {product.name}
          </h1>

          <div className="flex gap-2 flex-wrap mb-4">
            {product.certifications.map((cert) => (
              <span
                key={cert}
                className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full border border-emerald-100"
              >
                {cert}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="text-2xl font-medium text-gray-900 mb-5">
            ${product.price.toFixed(2)}
          </div>

          <AddToCartButton
            id={product.id}
            name={product.name}
            brand={product.brand}
            price={product.price}
            imageUrl={product.imageUrl}
            slug={product.slug}
          />

          <div className="mt-6 bg-emerald-50 rounded-xl p-4">
            <div className="text-xs font-medium text-emerald-800 uppercase tracking-wide mb-2">
              Why this product
            </div>
            <p className="text-sm text-emerald-700">
              Backed by clinical research and verified by third-party testing.
              Part of your personalized wellness protocol.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
import Image from "next/image";
import Link from "next/link";
import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import AddToCartButton from "../../components/AddToCartButton";
import AddToCartSmall from "../../components/AddToCartSmall";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: `${product.description} Certifications: ${product.certifications.join(", ")}. Shop natural health products at PureWell.`,
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 4,
  });

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "10px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9c9488", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#9c9488", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href={`/?category=${product.category}`} style={{ color: "#9c9488", textDecoration: "none", textTransform: "capitalize" }}>
            {product.category.replace(/-/g, " ")}
          </Link>
          <span>/</span>
          <span style={{ color: "#2d2a24" }}>{product.name}</span>
        </div>
      </div>

      {/* Back button */}
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px 0" }}>
      <Link
        href="/"
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#6b6560", textDecoration: "none" }}
      >
            ← Back to products
      </Link>
    </div>

      {/* Main product */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div className="product-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

          {/* Image */}
          <div style={{ position: "relative", width: "100%", height: "420px", background: "#f5f2ed", borderRadius: "20px", overflow: "hidden", border: "1px solid #e7e3dc" }}>
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5bfb5", fontSize: "14px" }}>
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: "500", color: "#3d6b4f", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {product.brand}
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#2d2a24", lineHeight: "1.3", marginBottom: "12px" }}>
              {product.name}
            </h1>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {product.certifications.map((cert) => (
                <span key={cert} style={{ fontSize: "11px", background: "#eef5f0", color: "#3d6b4f", padding: "4px 10px", borderRadius: "99px", fontWeight: "500", border: "1px solid #c8ddd0" }}>
                  {cert}
                </span>
              ))}
            </div>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.7", marginBottom: "20px" }}>
              {product.description}
            </p>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#2d2a24", marginBottom: "20px" }}>
              ${product.price.toFixed(2)}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <AddToCartButton
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                imageUrl={product.imageUrl}
                slug={product.slug}
                fullWidth={true}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
              {[["🌿", "All natural"], ["✓", "Third-party tested"], ["↩", "30-day returns"]].map((badge) => (
                <div key={badge[1]} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{badge[0]}</div>
                  <div style={{ fontSize: "11px", color: "#6b6560", fontWeight: "500" }}>{badge[1]}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "14px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                Why this product
              </div>
              <p style={{ fontSize: "13px", color: "#3d6b4f", lineHeight: "1.6" }}>
                Backed by clinical research and verified by third-party testing. Part of your personalized wellness protocol.
              </p>
              <Link href="/quiz" style={{ fontSize: "12px", color: "#3d6b4f", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
                Take the wellness quiz →
              </Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#2d2a24", marginBottom: "16px" }}>
              You might also like
            </h2>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {relatedProducts.map((related) => (
                <Link href={`/products/${related.slug}`} key={related.id} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", overflow: "hidden" }}>
                    <div style={{ position: "relative", width: "100%", height: "140px", background: "#f5f2ed" }}>
                      {related.imageUrl ? (
                        <Image src={related.imageUrl} alt={related.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5bfb5", fontSize: "12px" }}>
                          No image
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "12px" }}>
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "2px" }}>{related.brand}</div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "8px", lineHeight: "1.3" }}>{related.name}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#2d2a24" }}>${related.price.toFixed(2)}</span>
                        <AddToCartSmall
                          id={related.id}
                          name={related.name}
                          brand={related.brand}
                          price={related.price}
                          imageUrl={related.imageUrl}
                          slug={related.slug}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
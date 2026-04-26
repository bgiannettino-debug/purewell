import Link from "next/link";
import Image from "next/image";
import { db } from "../lib/db";
import BuyNowButton from "./components/BuyNowButton";
import CategoryFilter from "./components/CategoryFilter";
import RetailerFilter from "./components/RetailerFilter";
import SearchSuggest from "./components/SearchSuggest";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Natural Health Products & Wellness Supplements",
  description: "Curated all-natural supplements, essential oils, herbal teas, and wellness products. Non-GMO, organic, and third-party tested.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ category?: string; search?: string; retailers?: string }>;
};

const VALID_RETAILERS = ["amazon", "iherb", "thrive", "other"];

export default async function Home({ searchParams }: Props) {
  const { category, search, retailers } = await searchParams;

  const activeRetailers = retailers
    ? retailers.split(",").map((r) => r.trim()).filter((r) => VALID_RETAILERS.includes(r))
    : [];

  const totalProductCount = await db.product.count();

  const products = await db.product.findMany({
    where: {
      ...(category && category !== "all" ? { category } : {}),
      ...(activeRetailers.length > 0 ? { supplier: { in: activeRetailers } } : {}),
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
      <div style={{ background: "#faf8f5", borderBottom: "1px solid #e7e3dc", padding: "48px 24px" }}>
        <div className="hero-grid" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "99px", marginBottom: "16px" }}>
              🌿 AI-powered natural wellness
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#2d2a24", lineHeight: "1.25", marginBottom: "14px" }}>
              Your natural health<br />
              <span style={{ color: "#3d6b4f" }}>companion</span>
            </h1>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.7", marginBottom: "24px", maxWidth: "400px" }}>
              Curated all-natural supplements, homemade wellness recipes, and AI-powered health protocols — all in one place.
            </p>
            <div className="hero-cta-row" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/quiz" className="hero-cta" style={{ background: "#3d6b4f", color: "#fff", fontWeight: "600", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "14px", textAlign: "center" }}>
                Take the wellness quiz →
              </Link>
              <Link href="/analyze" className="hero-cta" style={{ background: "#fff", color: "#2d2a24", border: "1px solid #e7e3dc", fontWeight: "500", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "14px", textAlign: "center" }}>
                Analyze a label
              </Link>
              <Link href="/recipes" className="hero-cta" style={{ background: "#fff", color: "#2d2a24", border: "1px solid #e7e3dc", fontWeight: "500", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "14px", textAlign: "center" }}>
                Browse recipes
              </Link>
            </div>
            <div style={{ display: "flex", gap: "32px", marginTop: "28px" }}>
              {[[`${totalProductCount}+`, "Natural products"], ["8", "Free recipes"], ["100%", "All natural"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24" }}>{num}</div>
                  <div style={{ fontSize: "11px", color: "#9c9488" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[["#eef5f0", "🌿"], ["#fef6e7", "🍯"], ["#faf0ee", "🌸"], ["#eef5f0", "🫚"]].map(([bg, emoji], i) => (
              <div key={i} style={{ background: bg, borderRadius: "16px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category + retailer filters. On desktop these sit side by side; on
          mobile the .filter-row class stacks them vertically (CSS rule lives
          in app/globals.css) so the retailer chips have full width to wrap
          and the category row gets its own dedicated scroll lane. */}
      <div style={{ padding: "12px 24px", background: "#fff", borderBottom: "1px solid #e7e3dc" }}>
        <div
          className="filter-row"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* scroll-fade adds a right-edge gradient + slim scrollbar on
              mobile so users can tell the chip row is horizontally
              scrollable, plus a tiny chevron hint as a final cue. */}
          <div className="scroll-fade" style={{ flex: "1 1 auto", minWidth: 0, overflowX: "auto", position: "relative" }}>
            <CategoryFilter categories={categories} activeCategory={category || "all"} />
          </div>
          <div className="retailer-filter-wrap" style={{ flexShrink: 0 }}>
            <RetailerFilter activeRetailers={activeRetailers} />
          </div>
        </div>
      </div>

      {/* Products */}
      <div style={{ background: "#faf8f5", padding: "28px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "600", color: "#2d2a24" }}>
              {category && category !== "all"
                ? categories.find((c) => c.id === category)?.label
                : "All products"}{" "}
              <span style={{ color: "#9c9488", fontWeight: "400", fontSize: "14px" }}>
                ({products.length} items)
              </span>
            </h2>
            {/* Typeahead search — same component used in the navbar.
                Replaces the old GET form that didn't support live
                product suggestions. */}
            <div style={{ width: "240px", maxWidth: "100%" }}>
              <SearchSuggest variant="navbar" placeholder="Search products..." />
            </div>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#9c9488" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌿</div>
              <div style={{ fontSize: "14px" }}>No products found.</div>
              <Link href="/" style={{ color: "#3d6b4f", fontSize: "13px", marginTop: "8px", display: "inline-block" }}>
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", alignItems: "stretch" }}>
              {products.map((product) => (
                <div key={product.id} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ position: "relative", width: "100%", height: "160px", background: "#f5f2ed", flexShrink: 0 }}>
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5bfb5", fontSize: "13px" }}>
                          No image
                        </div>
                      )}
                      <div style={{ position: "absolute", top: "8px", left: "8px" }}>
                        {product.certifications.slice(0, 1).map((cert) => (
                          <span key={cert} style={{ fontSize: "10px", background: "rgba(255,255,255,0.92)", color: "#3d6b4f", padding: "2px 8px", borderRadius: "99px", fontWeight: "500", border: "1px solid #c8ddd0" }}>
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "14px 14px 0 14px", flex: 1 }}>
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "3px" }}>{product.brand}</div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "4px", lineHeight: "1.3" }}>{product.name}</div>
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "8px", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.description}
                      </div>
                    </div>
                  </Link>
                  <div style={{ padding: "0 14px 14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#2d2a24" }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <BuyNowButton
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      slug={product.slug}
                      affiliateUrl={product.affiliateUrl}
                      supplier={product.supplier || "amazon"}
                      asin={product.asin}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
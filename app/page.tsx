import Link from "next/link";
import Image from "next/image";
import { db } from "../lib/db";
import BuyNowButton from "./components/BuyNowButton";
import SearchSuggest from "./components/SearchSuggest";
import FilterDrawer from "./components/FilterDrawer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Natural Health Products & Wellness Supplements",
  description: "Curated all-natural supplements, essential oils, herbal teas, and wellness products. Non-GMO, organic, and third-party tested.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ category?: string; search?: string; retailers?: string; certs?: string }>;
};

const VALID_RETAILERS = ["amazon", "iherb", "thrive", "other"];
const VALID_CATEGORIES = [
  "supplements",
  "essential-oils",
  "herbal-teas",
  "skincare",
  "personal-care",
  "nutrition",
  "fitness",
];
const VALID_CERTS = [
  "USDA Organic",
  "Non-GMO",
  "Vegan",
  "Gluten-free",
  "Third-party tested",
  "GMP Certified",
  "Kosher",
  "Fair Trade",
];

export default async function Home({ searchParams }: Props) {
  const { category, search, retailers, certs } = await searchParams;

  const activeRetailers = retailers
    ? retailers.split(",").map((r) => r.trim()).filter((r) => VALID_RETAILERS.includes(r))
    : [];

  // Category became multi-select — comma-separated like retailers and
  // certs. Backward-compatible with the old single-value links since
  // a single id like 'supplements' parses to a one-element array. The
  // 'all' value (sometimes seen on legacy links) is filtered out via
  // the whitelist.
  const activeCategories = category
    ? category.split(",").map((c) => c.trim()).filter((c) => VALID_CATEGORIES.includes(c))
    : [];

  // Whitelist incoming cert ids so an attacker can't shove arbitrary
  // strings into a Prisma query via the URL.
  const activeCerts = certs
    ? certs.split(",").map((c) => c.trim()).filter((c) => VALID_CERTS.includes(c))
    : [];

  // Live counts so the hero stat tiles never lie about catalog size.
  // Hardcoding these means they go stale every time we add or remove
  // a product / recipe.
  const [totalProductCount, totalRecipeCount] = await Promise.all([
    db.product.count(),
    db.recipe.count(),
  ]);

  // Filters that apply to BOTH the cert-count pool and the displayed
  // products. The cert filter is layered on top of these for the
  // displayed set but excluded from the count pool, so per-chip
  // counts reflect "how many products in the current
  // category/retailer/search slice carry this cert" rather than
  // "how many remain after applying this cert too" (which would make
  // the count of the just-clicked chip drop to displayed.length and
  // confuse the user).
  const baseWhere = {
    ...(activeCategories.length > 0 ? { category: { in: activeCategories } } : {}),
    ...(activeRetailers.length > 0 ? { supplier: { in: activeRetailers } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { brand: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // Cheap query — only pulls the certifications array per row to
  // tally per-chip counts.
  const certPool = await db.product.findMany({
    where: baseWhere,
    select: { certifications: true },
  });
  const certCounts: Record<string, number> = {};
  for (const c of VALID_CERTS) certCounts[c] = 0;
  for (const p of certPool) {
    for (const c of p.certifications) {
      if (c in certCounts) certCounts[c]++;
    }
  }

  const products = await db.product.findMany({
    where: {
      ...baseWhere,
      ...(activeCerts.length > 0 ? { certifications: { hasEvery: activeCerts } } : {}),
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
    { id: "personal-care", label: "Personal care" },
    { id: "fitness", label: "Fitness" },
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
              {[[`${totalProductCount}+`, "Natural products"], [`${totalRecipeCount}`, "Free recipes"], ["100%", "All natural"]].map(([num, label]) => (
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

      {/* Filter drawer — opened via the FilterButton in the navbar
          (which only appears on this route). Holds category, retailer,
          and cert filters in a left-side slide-in panel. The previous
          always-visible sticky bar was retired because it ate too
          much screen real estate during product browsing. */}
      <FilterDrawer
        categories={categories}
        activeCategories={activeCategories}
        activeRetailers={activeRetailers}
        activeCerts={activeCerts}
        certCounts={certCounts}
        hasCerts={certPool.length > 0}
      />

      {/* Products */}
      <div style={{ background: "#faf8f5", padding: "28px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "600", color: "#2d2a24" }}>
              {/* Header reflects the multi-select category state:
                  - 0 selected → 'All products'
                  - 1 selected → that category's label
                  - 2+ selected → 'Selected products' (we could list
                    them, but it gets long quickly with 3+ picks). */}
              {activeCategories.length === 0
                ? "All products"
                : activeCategories.length === 1
                  ? (categories.find((c) => c.id === activeCategories[0])?.label ?? "Products")
                  : "Selected products"}{" "}
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
                        <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: "contain" }} />
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5bfb5", fontSize: "13px" }}>
                          No image
                        </div>
                      )}
                      <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                        {/* Pick up to 2 certs in priority order — buyer-
                            facing labels (Organic, Vegan, Non-GMO,
                            Gluten-free) read sooner than facility/process
                            certs (GMP, Third-party tested). 'USDA
                            Organic' is shortened to 'Organic' on the
                            card to save space. */}
                        {(["USDA Organic", "Vegan", "Non-GMO", "Gluten-free", "Fair Trade", "Kosher", "Third-party tested", "GMP Certified"] as const)
                          .filter((c) => product.certifications.includes(c))
                          .slice(0, 2)
                          .map((cert) => (
                            <span key={cert} style={{ fontSize: "10px", background: "rgba(255,255,255,0.92)", color: "#3d6b4f", padding: "2px 8px", borderRadius: "99px", fontWeight: "500", border: "1px solid #c8ddd0" }}>
                              {cert === "USDA Organic" ? "Organic" : cert}
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
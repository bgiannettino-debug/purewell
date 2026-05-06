import Link from "next/link";
import Image from "next/image";
import { db } from "../lib/db";
import BuyNowButton from "./components/BuyNowButton";
import CategoryFilter from "./components/CategoryFilter";
import RetailerFilter from "./components/RetailerFilter";
import CertFilter from "./components/CertFilter";
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
            {/* Stronger hook: leads with the user's pain ('confused
                about supplements') and the outcome ('actually work
                for you') instead of the generic 'companion' framing.
                The earlier headline was friendly but didn't promise
                anything specific. */}
            <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#2d2a24", lineHeight: "1.2", marginBottom: "14px" }}>
              Find supplements that<br />
              <span style={{ color: "#3d6b4f" }}>actually work for you</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#6b6560", lineHeight: 1.7, marginBottom: "24px", maxWidth: "460px" }}>
              Skip the trial-and-error. Our 90-second wellness quiz builds a personalized protocol — supplements matched to your goals, recipes you&apos;ll actually make, all curated for clean ingredients and real evidence.
            </p>

            {/* Single dominant CTA. Quiz wins because it's the
                highest-engagement entry point and feeds every other
                surface (product recommendations, recipe matches,
                email opt-in). The two former CTAs (analyze, browse)
                move down into smaller text-link affordances below. */}
            <Link
              href="/quiz"
              style={{ background: "#3d6b4f", color: "#fff", fontWeight: 600, padding: "14px 28px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", display: "inline-block" }}
            >
              Take the wellness quiz →
            </Link>

            {/* Trust line right under the CTA. Three quick reassurances
                that knock down the most common pre-click hesitations:
                cost, signup wall, time commitment. */}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px", fontSize: "12px", color: "#9c9488", flexWrap: "wrap" }}>
              <span>✓ Free</span>
              <span>✓ No signup required</span>
              <span>✓ 90 seconds</span>
            </div>

            {/* Secondary paths — text-link styled so they don't
                compete with the primary CTA. Users who already know
                what they want still have a fast path. */}
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e7e3dc", fontSize: "13px", color: "#6b6560" }}>
              Already know what you need?{" "}
              <Link href="/" style={{ color: "#3d6b4f", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Browse {totalProductCount}+ products
              </Link>
              {" · "}
              <Link href="/analyze" style={{ color: "#3d6b4f", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Analyze a label
              </Link>
              {" · "}
              <Link href="/recipes" style={{ color: "#3d6b4f", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                {totalRecipeCount} free recipes
              </Link>
            </div>
          </div>

          {/* Right column — faux personalized protocol preview.
              Replaces the four decorative emoji boxes with something
              that demonstrates the quiz's output. Shows what users
              actually get after taking the quiz, which is more
              persuasive than abstract imagery. */}
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 32px rgba(45,42,36,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "10px", color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "2px" }}>
                  Your wellness plan
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#2d2a24" }}>
                  Sleep & Recovery Protocol
                </div>
              </div>
              <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "10px", fontWeight: 600, padding: "4px 10px", borderRadius: "99px" }}>
                Sample
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                {
                  name: "Magnesium Glycinate",
                  brand: "Pure Encapsulations",
                  timing: "Evening",
                  reason: "Supports sleep + muscle relaxation",
                  goal: "sleep",
                },
                {
                  name: "Chamomile + Lavender Tea",
                  brand: "Recipe",
                  timing: "Bedtime",
                  reason: "Wind-down ritual, calming herbs",
                  goal: "stress",
                },
                {
                  name: "Ashwagandha KSM-66",
                  brand: "Himalaya",
                  timing: "Morning",
                  reason: "Adaptogen for cortisol balance",
                  goal: "stress",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{ background: "#faf8f5", border: "1px solid #e7e3dc", borderRadius: "12px", padding: "12px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2a24", lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <span style={{ fontSize: "10px", background: "#eef5f0", color: "#3d6b4f", padding: "2px 8px", borderRadius: "99px", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {item.timing}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "4px" }}>
                    {item.brand}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b6560", lineHeight: 1.5 }}>
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "14px", fontSize: "11px", color: "#9c9488", textAlign: "center", lineHeight: 1.5 }}>
              Personalized based on your goals, dietary preferences, and budget.
            </div>
          </div>
        </div>
      </div>

      {/* Label analyzer spotlight. Placed between the hero and the
          products section because it's a discovery-friendly feature
          that benefits from a dedicated callout — most visitors won't
          know to look for it as a CTA in the hero. Two columns on
          desktop (pitch left, fake analyzer-result preview right);
          stacks vertically on mobile via the .analyzer-spotlight
          class in globals.css. */}
      <div style={{ background: "#eef5f0", borderBottom: "1px solid #c8ddd0", padding: "48px 24px" }}>
        <div className="analyzer-spotlight" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          {/* Left: pitch */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: 500, padding: "5px 12px", borderRadius: "99px", marginBottom: "14px" }}>
              🔬 AI label analyzer
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#2d2a24", lineHeight: 1.25, marginBottom: "12px" }}>
              Snap a supplement label.<br />
              <span style={{ color: "#3d6b4f" }}>See what&apos;s really inside.</span>
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "20px", maxWidth: "440px" }}>
              Drop in a photo of any supplement label. Our AI breaks down each ingredient by quality, flags fillers and synthetic additives, and tells you which ones are worth your money — and which to skip.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { icon: "✓", text: "Identifies red-flag ingredients (artificial dyes, magnesium stearate, titanium dioxide)" },
                { icon: "✓", text: "Spots dosing red flags — under-dosed actives, proprietary blends" },
                { icon: "✓", text: "Suggests cleaner alternatives from our curated catalog" },
                { icon: "✓", text: "Free, instant, and works on any brand — even ones we don't carry" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", background: "#3d6b4f", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: "13px", color: "#2d2a24", lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/analyze"
              style={{ background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: 600, padding: "13px 28px", borderRadius: "12px", textDecoration: "none", display: "inline-block" }}
            >
              Try the label analyzer →
            </Link>
            <div style={{ fontSize: "12px", color: "#9c9488", marginTop: "10px" }}>
              Takes about 10 seconds. No signup required.
            </div>
          </div>

          {/* Right: faux analyzer result preview. Hand-rolled JSX so it
              matches the rest of the site's palette and breakpoints
              instead of needing a real screenshot. */}
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", boxShadow: "0 8px 24px rgba(45,42,36,0.06)" }}>
            <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
              Sample analysis
            </div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#2d2a24", marginBottom: "10px" }}>
              Generic Brand Magnesium Complex
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fef6e7", border: "1px solid #f0d4a0", color: "#8a6020", fontSize: "12px", fontWeight: 600, padding: "5px 11px", borderRadius: "99px" }}>
                ⚠️ 6/10 — Mediocre
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "Magnesium oxide", note: "Cheapest form. Low absorption (~4%).", quality: "warning" },
                { name: "Magnesium glycinate", note: "Highly bioavailable. Good for sleep.", quality: "good" },
                { name: "Microcrystalline cellulose", note: "Filler. Inert but adds bulk.", quality: "neutral" },
                { name: "Titanium dioxide", note: "EU-banned colorant. Avoid.", quality: "warning" },
              ].map((ing) => {
                const colors =
                  ing.quality === "good"
                    ? { bg: "#eef5f0", border: "#c8ddd0", dot: "#3d6b4f" }
                    : ing.quality === "warning"
                      ? { bg: "#fdf0ee", border: "#f5c6c0", dot: "#c0392b" }
                      : { bg: "#f5f2ed", border: "#e7e3dc", dot: "#9c9488" };
                return (
                  <div key={ing.name} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "10px 12px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.dot, flexShrink: 0, marginTop: "6px" }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2a24", marginBottom: "2px" }}>{ing.name}</div>
                      <div style={{ fontSize: "11px", color: "#6b6560", lineHeight: 1.5 }}>{ing.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP-ONLY sticky filter bar. Pinned below the navbar so
          all three filter dimensions stay accessible while scrolling.
          Hidden on ≤768px via the .desktop-filter-bar class — mobile
          uses the FilterDrawer (triggered from the navbar Filters
          button) instead because horizontal real estate is too tight
          for a chip row stack on phones. Inline labels here ('Products',
          'Shop from', 'Certified') replace the per-component labels we
          dropped when the drawer became the primary mobile UX. */}
      <div className="desktop-filter-bar" style={{ padding: "12px 24px", background: "#fff", borderBottom: "1px solid #e7e3dc", position: "sticky", zIndex: 20 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 auto", minWidth: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
              Products
            </span>
            <div style={{ flex: "1 1 auto", minWidth: 0, overflowX: "auto" }}>
              <CategoryFilter categories={categories} activeCategories={activeCategories} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
              Shop from
            </span>
            <RetailerFilter activeRetailers={activeRetailers} />
          </div>
        </div>
        {certPool.length > 0 && (
          <div style={{ maxWidth: "1200px", margin: "10px auto 0", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
              Certified
            </span>
            <CertFilter activeCerts={activeCerts} certCounts={certCounts} />
          </div>
        )}
      </div>

      {/* Filter drawer — mobile filter UX. The button that opens it
          lives in the Navbar and is hidden on desktop (where the
          sticky bar above handles filtering instead). */}
      <FilterDrawer
        categories={categories}
        activeCategories={activeCategories}
        activeRetailers={activeRetailers}
        activeCerts={activeCerts}
        certCounts={certCounts}
        hasCerts={certPool.length > 0}
      />

      {/* Products — id="products" anchors the section so the
          FilterDrawer's 'See results' button can scroll the grid into
          view. scroll-margin-top in globals.css offsets for the
          sticky navbar so the section header isn't hidden under it. */}
      <div id="products" style={{ background: "#faf8f5", padding: "28px 24px" }}>
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
                      {/* Goal pills lead — what this product helps with
                          is the buyer's main mental hook (sleep, stress,
                          immune). Show up to 2 to keep the card clean. */}
                      {product.goals.length > 0 && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
                          {product.goals.slice(0, 2).map((goal) => (
                            <span
                              key={goal}
                              style={{
                                fontSize: "10px",
                                background: "#eef5f0",
                                color: "#3d6b4f",
                                border: "1px solid #c8ddd0",
                                padding: "2px 8px",
                                borderRadius: "99px",
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            >
                              {goal}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Product name leads — it's the "what's in it" bit
                          (e.g. 'Magnesium Glycinate 400mg'). Brand
                          becomes a small byline below. */}
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2a24", marginBottom: "2px", lineHeight: "1.3" }}>{product.name}</div>
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "8px" }}>by {product.brand}</div>
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "8px", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.description}
                      </div>
                    </div>
                  </Link>
                  <div className="product-action-row" style={{ padding: "0 14px 14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
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
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../../lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 10 Herbal Supplement Manufacturers",
  description:
    "Our ranked list of the 10 best herbal supplement makers, scored against 8 quality standards: organic, non-GMO, vegan, gluten-free, third-party tested, GMP certified, Kosher, and Fair Trade.",
};

// Force-dynamic so the 'In our catalog' badge stays accurate as
// products are added or removed.
export const dynamic = "force-dynamic";

// The 8 quality standards the user wanted brands graded against.
// Order matches the user's request and appears in each brand's
// badge row. Keep the labels consistent with the certifications
// stored on Product.certifications.
const STANDARDS = [
  "Organic",
  "Non-GMO",
  "Vegan",
  "Gluten-free",
  "Third-party tested",
  "GMP Certified",
  "Kosher",
  "Fair Trade",
] as const;

type Standard = (typeof STANDARDS)[number];

type Brand = {
  rank: number;
  name: string;
  specialty: string;
  description: string;
  // Certifications the brand actively holds across most or all of
  // their herbal product line. Items listed here render as filled
  // green badges; everything else from STANDARDS renders dim/gray
  // so the user can see at-a-glance which boxes they tick.
  holds: Standard[];
  // Optional caveat — brands that have changed ownership or have
  // partial certifications get a one-line footnote.
  note?: string;
};

// Editorial guidelines for revising this list (re-review at least
// annually):
// - Each brand must be a credible herbal supplement maker (not just a
//   broad supplement house) — the page targets "herbal" specifically.
// - Hold at minimum: Organic OR Non-GMO + Third-party tested + GMP.
//   The other certifications are bonus — many strong brands don't
//   hold them all.
// - "Holds" means most or all of the brand's herbal line, not just
//   a single SKU. Ownership changes (Pukka → Unilever, Garden of
//   Life → Nestlé) are surfaced in `note` rather than excluding the
//   brand if standards have demonstrably held.
const BRANDS: Brand[] = [
  {
    rank: 1,
    name: "Traditional Medicinals",
    specialty: "Herbalist-formulated functional teas & extracts",
    description:
      "Pharmacopoeial-grade herbs (medicinal quality, not just culinary), formulations following European Medicines Agency monographs, and a certified B Corp. Holds the most certifications of anyone on this list — they meet every one of the eight standards across most of their line.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified", "Kosher", "Fair Trade"],
  },
  {
    rank: 2,
    name: "Organic India",
    specialty: "Tulsi (holy basil) and Ayurvedic blends",
    description:
      "Sources from regenerative organic farms in India under Fair for Life, the strictest fair-trade standard. Brought tulsi to Western wellness and remains the reference point for the herb. Wide certification footprint covers practically every standard a buyer might check for.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified", "Kosher", "Fair Trade"],
  },
  {
    rank: 3,
    name: "Pukka Herbs",
    specialty: "Organic herbal teas and supplements",
    description:
      "Co-founded by an Ayurvedic practitioner, 100% organic across the line, Fair for Life certified throughout. Beautiful blend formulations — their bestsellers (Three Tulsi, Night Time, Detox) consistently outperform comparable products in independent reviews.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified", "Fair Trade"],
    note: "Owned by Unilever since 2017; quality and certifications have held post-acquisition.",
  },
  {
    rank: 4,
    name: "Gaia Herbs",
    specialty: "Liquid herbal extracts and capsules",
    description:
      "Owns and operates a 350-acre certified-organic herb farm in North Carolina — vertical integration most brands don't have. Their Meet Your Herbs traceability tool lets you look up the specific batch and lot of any product. Strongest pick for full-spectrum tinctures and adaptogens.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified"],
  },
  {
    rank: 5,
    name: "Mountain Rose Herbs",
    specialty: "Bulk herbs, oils, and DIY ingredients",
    description:
      "Oregon-based B Corp, certified organic specialist. The go-to source if you make your own teas, tinctures, or salves at home. Their sustainability commitments (renewable energy, zero waste, regenerative sourcing partnerships) are among the most documented in the industry.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified", "Fair Trade"],
  },
  {
    rank: 6,
    name: "Banyan Botanicals",
    specialty: "Ayurvedic herbs and herbal blends",
    description:
      "Practitioner-grade Ayurvedic specialty house. Fair for Life certified, USDA Organic across the line, member-owned. Their ashwagandha, brahmi, and triphala formulations are repeatedly recommended by Ayurvedic doctors as benchmark products.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified", "Fair Trade"],
  },
  {
    rank: 7,
    name: "Herb Pharm",
    specialty: "Single-herb tinctures and extracts",
    description:
      "Operating since 1979, USDA Organic across most products, fresh-herb extraction (vs. dry) for higher actives. Strongest pick for traditional single-herb tinctures — echinacea, milk thistle, valerian, etc. — when you want one specific botanical, not a blend.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified"],
  },
  {
    rank: 8,
    name: "Host Defense",
    specialty: "Functional mushroom extracts",
    description:
      "Founded by mycologist Paul Stamets. Uses both fruiting body and mycelium with documented full-spectrum extraction — important for full medicinal benefits. Organic, sustainably grown in the US. Lion's mane, reishi, and turkey tail products set the bar in this category.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified"],
  },
  {
    rank: 9,
    name: "Garden of Life",
    specialty: "Whole-food herbal blends",
    description:
      "USDA Organic and Non-GMO Project Verified across most of their line — rare in supplements. Their mykind Organics line was the first whole-food multivitamin to hold both certifications. Best for buyers who want adaptogens combined with whole-food vitamin/mineral support.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified"],
    note: "Acquired by Nestlé in 2017; mykind Organics formulations and certifications have remained intact.",
  },
  {
    rank: 10,
    name: "MegaFood",
    specialty: "Whole-food herb + nutrient blends",
    description:
      "Glyphosate Residue Free certified — the first supplement brand to test for it — alongside Non-GMO Project Verified and many USDA Organic SKUs. Their Daily Herbal line pairs adaptogens (ashwagandha, holy basil, turmeric) with whole-food cofactors for better absorption.",
    holds: ["Organic", "Non-GMO", "Vegan", "Gluten-free", "Third-party tested", "GMP Certified"],
    note: "Glyphosate Residue Free certification (a third-party tested standard) is unique to this brand at scale.",
  },
];

export default async function TopBrandsPage() {
  // Pull distinct brand names from the live catalog so we can show
  // an "In our catalog" pill on brands we currently carry.
  const products = await db.product.findMany({
    select: { brand: true },
    distinct: ["brand"],
  });
  const inCatalog = new Set(products.map((p) => p.brand.toLowerCase()));

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Hero */}
        <div style={{ marginBottom: "36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#eef5f0",
              border: "1px solid #c8ddd0",
              color: "#3d6b4f",
              fontSize: "12px",
              fontWeight: 500,
              padding: "5px 12px",
              borderRadius: "99px",
              marginBottom: "16px",
            }}
          >
            🌿 Ranked picks
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#2d2a24",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}
          >
            Top 10 herbal supplement manufacturers
          </h1>
          <p style={{ fontSize: "15px", color: "#6b6560", lineHeight: 1.7 }}>
            Our ranked picks for the herbal supplement makers we trust most — judged against eight quality standards. The list is editorial: based on certifications held, transparency of sourcing, formulation quality, and reputation among practitioners.
          </p>
          <p style={{ fontSize: "13px", color: "#9c9488", marginTop: "16px" }}>
            Last reviewed April 2026. Re-reviewed at least annually as brands change ownership, formulations, or certifications.
          </p>
        </div>

        {/* Standards card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e7e3dc",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2d2a24", marginBottom: "12px" }}>
            The 8 standards we check
          </h2>
          <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "12px" }}>
            Each brand is graded against the eight badges below. Filled green = the brand holds that standard across most or all of their herbal line. Gray = they don&apos;t hold it (or only on a small subset of products).
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {STANDARDS.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "11px",
                  background: "#eef5f0",
                  color: "#3d6b4f",
                  border: "1px solid #c8ddd0",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Ranked list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {BRANDS.map((b) => {
            const carried = inCatalog.has(b.name.toLowerCase());
            return (
              <article
                key={b.name}
                style={{
                  background: "#fff",
                  border: "1px solid #e7e3dc",
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  gap: "16px",
                }}
              >
                {/* Rank circle */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#3d6b4f",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                  aria-label={`Rank ${b.rank}`}
                >
                  {b.rank}
                </div>

                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#2d2a24", margin: 0 }}>
                      {b.name}
                    </h3>
                    {carried && (
                      <span
                        style={{
                          fontSize: "10px",
                          background: "#eef5f0",
                          color: "#3d6b4f",
                          border: "1px solid #c8ddd0",
                          padding: "2px 8px",
                          borderRadius: "99px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        In our catalog
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#3d6b4f", fontWeight: 500, marginBottom: "10px" }}>
                    {b.specialty}
                  </div>
                  <p style={{ fontSize: "13px", color: "#6b6560", lineHeight: 1.7, margin: "0 0 12px" }}>
                    {b.description}
                  </p>

                  {/* Cert badges — held are green, missing are dim gray */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: b.note ? "10px" : 0 }}>
                    {STANDARDS.map((s) => {
                      const held = b.holds.includes(s);
                      return (
                        <span
                          key={s}
                          style={{
                            fontSize: "10px",
                            fontWeight: 500,
                            padding: "3px 9px",
                            borderRadius: "99px",
                            background: held ? "#eef5f0" : "#faf8f5",
                            color: held ? "#3d6b4f" : "#c5bfb5",
                            border: `1px solid ${held ? "#c8ddd0" : "#e7e3dc"}`,
                            opacity: held ? 1 : 0.7,
                          }}
                          title={held ? `${s} — held` : `${s} — not held / only on subset`}
                        >
                          {held ? "✓ " : ""}
                          {s}
                        </span>
                      );
                    })}
                  </div>

                  {b.note && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#9c9488",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      Note: {b.note}
                    </div>
                  )}

                  {carried && (
                    <Link
                      href={`/?search=${encodeURIComponent(b.name)}`}
                      style={{
                        display: "inline-block",
                        fontSize: "12px",
                        color: "#3d6b4f",
                        fontWeight: 600,
                        textDecoration: "none",
                        marginTop: "10px",
                      }}
                    >
                      See {b.name} products on PureWell →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Closer */}
        <div
          style={{
            background: "#eef5f0",
            border: "1px solid #c8ddd0",
            borderRadius: "16px",
            padding: "20px",
            fontSize: "13px",
            color: "#3d6b4f",
            lineHeight: 1.7,
            marginTop: "24px",
          }}
        >
          Looking for brands beyond herbal supplements (essential oils, skincare, fitness)?{" "}
          <Link href="/brands" style={{ color: "#3d6b4f", textDecoration: "underline", fontWeight: 600 }}>
            Browse our full Brands We Trust directory →
          </Link>
          <br />
          <br />
          PureWell may earn an affiliate commission on purchases through our links. Editorial choices about which brands appear here are independent of commission rates — we only recommend brands we&apos;d use ourselves. See our{" "}
          <Link href="/disclosure" style={{ color: "#3d6b4f", textDecoration: "underline" }}>
            Affiliate Disclosure
          </Link>
          .
        </div>
      </div>

      <Footer />
    </main>
  );
}

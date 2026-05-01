import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../../lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trusted Brands — PureWell",
  description:
    "The natural wellness brands PureWell trusts — supplements, essential oils, herbal teas, skincare, and more. Each brand vetted against our standards for clean ingredients, third-party testing, and transparent sourcing.",
};

// Force-dynamic so the 'In our catalog' badge stays accurate as
// products are added or removed. Cheap query — we only fetch
// distinct brand strings.
export const dynamic = "force-dynamic";

// Curated list of brands PureWell vouches for. Hardcoded here rather
// than backed by a Brand DB model because (a) the list rarely changes,
// (b) the descriptions are editorial and need a human author, and
// (c) keeping it in code makes the page reviewable in PR diffs.
//
// Editorial guidelines for adding to this list:
// - The brand must meet at least 2 of the 4 standards (clean
//   ingredients / third-party tested / transparent sourcing /
//   evidence-backed formulations).
// - The "why" copy must be specific — what makes THIS brand worth
//   trusting, not generic praise.
// - Don't make absolute claims ("the best") — say "we trust" or
//   "recommend" so it's clearly editorial opinion.
// - Re-review at least annually for ownership changes, recalls,
//   formulation shifts.

type BrandCategory =
  | "supplements"
  | "essential-oils"
  | "herbal-teas"
  | "nutrition"
  | "skincare"
  | "personal-care"
  | "fitness";

type Brand = {
  name: string;
  category: BrandCategory;
  specialty: string;
  why: string;
};

const BRANDS: Brand[] = [
  // ── Supplements ──────────────────────────────────────────────────
  {
    name: "Thorne",
    category: "supplements",
    specialty: "Practitioner-grade, evidence-based",
    why: "One of the few supplement brands with third-party testing on every batch and clinical research collaborations with the Mayo Clinic. NSF Certified for Sport on many products. Higher price reflects the QA bar.",
  },
  {
    name: "Pure Encapsulations",
    category: "supplements",
    specialty: "Hypoallergenic, clean formulations",
    why: "Free of common allergens (gluten, dairy, soy, GMOs) and unnecessary fillers. Practitioner-favorite for sensitive patients. Every product third-party tested for potency and purity.",
  },
  {
    name: "Nordic Naturals",
    category: "supplements",
    specialty: "Fish oil and omega-3s",
    why: "Sustainably sourced wild-caught fish, third-party tested for heavy metals and oxidation. Friend of the Sea certified. Their omega-3 freshness benchmarks set the industry standard.",
  },
  {
    name: "Garden of Life",
    category: "supplements",
    specialty: "Whole-food, organic",
    why: "Many products are USDA Organic and Non-GMO Project Verified, which is rare in supplements. Strong probiotic and protein lineups. Note: now owned by Nestlé but core formulations remain transparent.",
  },
  {
    name: "Gaia Herbs",
    category: "supplements",
    specialty: "Liquid herbal extracts and tinctures",
    why: "Owns and operates a 350-acre certified-organic herb farm in North Carolina. Their Meet-Your-Herbs traceability tool lets you look up the specific batch and lot of any product.",
  },
  {
    name: "Jarrow Formulas",
    category: "supplements",
    specialty: "Research-backed, fair-priced",
    why: "Decades-old reputation in the practitioner space. Formulations follow current research (e.g., methylated B-vitamins, K2 MK-7). Solid value relative to higher-end brands.",
  },
  {
    name: "NOW Foods",
    category: "supplements",
    specialty: "Broad lineup, accessible pricing",
    why: "Family-owned since 1968. In-house testing labs and published QA standards put them ahead of most value-tier brands. Best fit when you want a no-frills, well-tested option.",
  },
  {
    name: "Host Defense",
    category: "supplements",
    specialty: "Functional mushrooms",
    why: "Founded by mycologist Paul Stamets. Uses both fruiting body and mycelium with documented full-spectrum extraction. Organic, sustainably grown in the US.",
  },
  {
    name: "Himalaya Wellness",
    category: "supplements",
    specialty: "Ayurvedic herbs",
    why: "Long-established Ayurvedic brand with their own clinical research arm. Standardized extracts you can dose reliably. Useful for ashwagandha, turmeric, and triphala specifically.",
  },
  {
    name: "Vital Proteins",
    category: "supplements",
    specialty: "Collagen peptides",
    why: "Pioneered the modern collagen-peptide category. Grass-fed, pasture-raised sources for bovine collagen; wild-caught for marine. Mixes cleanly without clumping.",
  },

  // ── Essential oils ───────────────────────────────────────────────
  {
    name: "Plant Therapy",
    category: "essential-oils",
    specialty: "Pure essential oils, kid-safe lineup",
    why: "GC/MS testing publicly available on every oil. KidSafe certified blends with Robert Tisserand's involvement. Direct-to-consumer pricing with no MLM markup.",
  },
  {
    name: "Rocky Mountain Oils",
    category: "essential-oils",
    specialty: "Pure essential oils",
    why: "Third-party GC/MS testing on every batch with results published per lot. Solid alternative to MLM oil brands at fairer prices. Their S.A.A.F.E. promise covers sourcing transparency.",
  },
  {
    name: "Mountain Rose Herbs",
    category: "essential-oils",
    specialty: "Bulk herbs, oils, and DIY ingredients",
    why: "Oregon-based, B Corp certified, USDA Organic specialist. Best source for raw herbs, dried flowers, carrier oils, and DIY recipe ingredients. Sustainability is core to their model, not marketing.",
  },

  // ── Herbal teas ──────────────────────────────────────────────────
  {
    name: "Traditional Medicinals",
    category: "herbal-teas",
    specialty: "Herbalist-formulated functional teas",
    why: "Pharmacopoeial-grade herbs (medicinal-quality, not just culinary). Their formulations follow the European Medicines Agency monographs. Good when you want tea that's actually doing something.",
  },
  {
    name: "Yogi Tea",
    category: "herbal-teas",
    specialty: "Wellness blends, accessible",
    why: "Wide flavor range from a 50-year-old company. Most blends are USDA Organic and Non-GMO Project Verified. Good entry point to herbal tea before stepping up to specialty brands.",
  },
  {
    name: "Pukka Herbs",
    category: "herbal-teas",
    specialty: "Organic, ethically sourced",
    why: "100% organic across the line. Co-founded by an Ayurvedic practitioner. Strong emphasis on Fair for Life certification and ethical herb sourcing — the company is now owned by Unilever but standards have held.",
  },
  {
    name: "Organic India",
    category: "herbal-teas",
    specialty: "Tulsi and Ayurvedic blends",
    why: "Specialty in tulsi (holy basil). Sources from regenerative organic farms in India under Fair for Life standards. Their tulsi is what introduced the herb to Western wellness.",
  },

  // ── Nutrition / whole foods ──────────────────────────────────────
  {
    name: "Navitas Organics",
    category: "nutrition",
    specialty: "Superfood powders",
    why: "Organic and Non-GMO Project Verified across the line. Cacao, maca, acai, chia. Family-run for over 20 years with consistent sourcing relationships.",
  },
  {
    name: "Nutiva",
    category: "nutrition",
    specialty: "Organic hemp, chia, MCT, coconut",
    why: "B Corp and one of the early movers in organic superfoods. Their Coconut MCT and hemp hearts are reference-grade and reasonably priced.",
  },
  {
    name: "Four Sigmatic",
    category: "nutrition",
    specialty: "Mushroom and adaptogen drinks",
    why: "Brought functional mushrooms (lion's mane, reishi, chaga) into the mainstream. USDA Organic dual-extracted mushrooms (water + alcohol) — important for full-spectrum benefits.",
  },

  // ── Skincare ─────────────────────────────────────────────────────
  {
    name: "Trilogy",
    category: "skincare",
    specialty: "Rosehip oil and natural skincare",
    why: "Their certified-organic rosehip oil set the gold standard in the category. New Zealand-based with strong sustainability commitments. Cruelty-free across the line.",
  },
  {
    name: "Acure",
    category: "skincare",
    specialty: "Affordable clean skincare and haircare",
    why: "Vegan and cruelty-free with EWG-friendly formulations. Actually affordable, unlike most clean beauty. The Brightening line and curl-care shampoos are repeat favorites.",
  },
  {
    name: "Mad Hippie",
    category: "skincare",
    specialty: "Active serums",
    why: "Their Vitamin C serum is one of the best-formulated in the natural space — properly stabilized L-ascorbic acid plus ferulic acid. Reasonable price point for actually-effective serum.",
  },

  // ── Personal care ────────────────────────────────────────────────
  {
    name: "Dr. Bronner's",
    category: "personal-care",
    specialty: "Pure-Castile soaps",
    why: "Family-owned since 1948. Fair Trade and USDA Organic. Their 18-in-1 soap genuinely does most cleaning jobs. Famously transparent labels.",
  },
  {
    name: "Native",
    category: "personal-care",
    specialty: "Aluminum-free deodorant",
    why: "Pioneered the modern clean-deodorant category. No aluminum, parabens, or phthalates. Wide scent lineup that performs reliably across a workout.",
  },
  {
    name: "Schmidt's",
    category: "personal-care",
    specialty: "Natural deodorant and toothpaste",
    why: "Plant-derived ingredients, vegan, cruelty-free. Their charcoal-magnesium formula is one of the most effective natural deodorants. Now owned by Unilever; formulations have remained intact.",
  },
  {
    name: "Hello",
    category: "personal-care",
    specialty: "Oral care",
    why: "Vegan toothpaste with both fluoride and fluoride-free options. SLS-free. Refreshing flavor lineup, friendly to sensitive teeth. Honest labeling about what's in and what isn't.",
  },

  // ── Fitness ──────────────────────────────────────────────────────
  {
    name: "LMNT",
    category: "fitness",
    specialty: "Electrolytes",
    why: "No sugar, no artificial sweeteners, no questionable additives. Sodium/potassium/magnesium ratio is appropriate for actual electrolyte replacement, not just thirst quenching.",
  },
  {
    name: "Naked Nutrition",
    category: "fitness",
    specialty: "Single-ingredient protein and supplements",
    why: "Their products are typically just one ingredient — Naked Whey is grass-fed whey concentrate, period. No flavors, sweeteners, or fillers. Lab-test results published openly.",
  },
  {
    name: "Sunwarrior",
    category: "fitness",
    specialty: "Plant-based protein",
    why: "Pea + hemp + goji blend with a complete amino acid profile. Organic, non-GMO, no soy. Mixes smoother than most plant proteins. Vegan-certified.",
  },
];

const CATEGORY_LABELS: Record<BrandCategory, string> = {
  supplements: "Supplements",
  "essential-oils": "Essential oils",
  "herbal-teas": "Herbal teas",
  nutrition: "Nutrition & superfoods",
  skincare: "Skincare",
  "personal-care": "Personal care",
  fitness: "Fitness",
};

const CATEGORY_ORDER: BrandCategory[] = [
  "supplements",
  "essential-oils",
  "herbal-teas",
  "nutrition",
  "skincare",
  "personal-care",
  "fitness",
];

export default async function BrandsPage() {
  // Pull the distinct brand list currently in the catalog so we can
  // show an "In our catalog" pill on brands we actively carry.
  const products = await db.product.findMany({
    select: { brand: true },
    distinct: ["brand"],
  });
  const inCatalog = new Set(products.map((p) => p.brand.toLowerCase()));

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    brands: BRANDS.filter((b) => b.category === cat),
  })).filter((g) => g.brands.length > 0);

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
            🌿 Curated brand list
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
            Brands we trust
          </h1>
          <p style={{ fontSize: "15px", color: "#6b6560", lineHeight: 1.7 }}>
            The natural wellness industry is crowded, and a clean label doesn&apos;t always mean a clean product. These are the brands PureWell recommends — vetted against our standards for clean ingredients, third-party testing, transparent sourcing, and evidence-backed formulations.
          </p>
          <p style={{ fontSize: "13px", color: "#9c9488", marginTop: "16px" }}>
            Last reviewed April 2026. We update this list at least annually as brands change ownership, formulations, or certifications.
          </p>
        </div>

        {/* Selection criteria */}
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
            How we vet brands
          </h2>
          <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "10px" }}>
            To make this list a brand has to meet at least two of the four standards below. Most listed brands meet three or four:
          </p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {[
              ["Clean ingredients", "No artificial fillers, synthetic dyes, or unnecessary additives. Hypoallergenic where possible."],
              ["Third-party testing", "Independent labs verify potency, purity, and absence of heavy metals or contaminants."],
              ["Transparent sourcing", "Public information about where ingredients come from, often backed by certifications (USDA Organic, Non-GMO Project, Fair Trade)."],
              ["Evidence-backed formulations", "Doses and combinations follow published research, not marketing trends."],
            ].map(([title, desc]) => (
              <li
                key={title}
                style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "6px" }}
              >
                <strong style={{ color: "#2d2a24" }}>{title}.</strong> {desc}
              </li>
            ))}
          </ul>
        </div>

        {/* Brand groups */}
        {grouped.map((group) => (
          <section key={group.category} style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d2a24",
                marginBottom: "14px",
                paddingBottom: "8px",
                borderBottom: "2px solid #3d6b4f",
                display: "inline-block",
              }}
            >
              {group.label}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {group.brands.map((b) => {
                const carried = inCatalog.has(b.name.toLowerCase());
                return (
                  <div
                    key={b.name}
                    style={{
                      background: "#fff",
                      border: "1px solid #e7e3dc",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "6px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#2d2a24",
                          margin: 0,
                        }}
                      >
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
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#3d6b4f",
                        fontWeight: 500,
                        marginBottom: "8px",
                      }}
                    >
                      {b.specialty}
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b6560", lineHeight: 1.7, margin: 0 }}>
                      {b.why}
                    </p>
                    {carried && (
                      <Link
                        href={`/?search=${encodeURIComponent(b.name)}`}
                        style={{
                          display: "inline-block",
                          fontSize: "13px",
                          color: "#3d6b4f",
                          fontWeight: 500,
                          textDecoration: "none",
                          marginTop: "10px",
                        }}
                      >
                        See {b.name} products on PureWell →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Affiliate footnote */}
        <div
          style={{
            background: "#eef5f0",
            border: "1px solid #c8ddd0",
            borderRadius: "16px",
            padding: "20px",
            fontSize: "13px",
            color: "#3d6b4f",
            lineHeight: 1.7,
            marginTop: "16px",
          }}
        >
          PureWell may earn an affiliate commission on purchases through our links. Our editorial choices about which brands appear on this page are independent of commission rates — we only recommend brands we&apos;d use ourselves. See our{" "}
          <Link href="/disclosure" style={{ color: "#3d6b4f", textDecoration: "underline" }}>
            Affiliate Disclosure
          </Link>{" "}
          for details.
        </div>
      </div>

      <Footer />
    </main>
  );
}

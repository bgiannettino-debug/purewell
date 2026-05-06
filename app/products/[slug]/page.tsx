import Image from "next/image";
import Link from "next/link";
import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import BuyNowButton from "../../components/BuyNowButton";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  // When the user lands here from the quiz protocol, the URL carries
  // ?from=quiz so we can offer a "Back to recommendations" affordance
  // instead of dropping them on the full product browser.
  searchParams: Promise<{ from?: string }>;
};

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

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;
  const fromQuiz = from === "quiz";

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  // Related products — fetch a candidate pool sharing this product's
  // goals OR category, then rank in JS by overlap so goal-matched
  // results win over plain category matches. Goals are the truer
  // signal of "is this useful for the same use case" than category.
  // Cap at 4. If the product has no goals (legacy data), the OR
  // collapses to category-only and behaves like the old query.
  const productGoals = product.goals as string[];
  const relatedCandidates = await db.product.findMany({
    where: {
      id: { not: product.id },
      inStock: true,
      OR: [
        ...(productGoals.length > 0 ? [{ goals: { hasSome: productGoals } }] : []),
        { category: product.category },
      ],
    },
  });
  const relatedProducts = relatedCandidates
    .map((p) => {
      const sharedGoals = (p.goals as string[]).filter((g) => productGoals.includes(g)).length;
      const categoryMatch = p.category === product.category ? 0.5 : 0;
      return { product: p, score: sharedGoals + categoryMatch };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.product);

  // Recipes that use this product. Inverse of the recipe page's
  // ingredient → product matching: scan every recipe's ingredient
  // list and look for a fuzzy substring match on this product's
  // name. Same loose heuristic in both directions so a match in
  // one place implies a match in the other.
  //
  // We pull the full recipe set with select-only ingredient/meta
  // fields. Catalog stays small (~20 recipes); when it grows past
  // 100+, swap in a Postgres trigram index or a pre-computed
  // ingredient-to-product join table.
  const productNameLower = product.name.toLowerCase();
  const productFirstWord = productNameLower.split(" ")[0];
  const allRecipes = await db.recipe.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      prepTime: true,
      costPerServing: true,
      goals: true,
      ingredients: true,
    },
  });
  const usedInRecipes = allRecipes
    .filter((r) => {
      const ings = r.ingredients as { amount: string; name: string }[];
      return ings.some((ing) => {
        const ingLower = ing.name.toLowerCase();
        return (
          // Bidirectional contains so 'Ashwagandha KSM-66' matches
          // 'ashwagandha root powder' and vice versa.
          ingLower.includes(productNameLower) ||
          productNameLower.includes(ingLower) ||
          ingLower.includes(productFirstWord) ||
          (ingLower.length > 3 && productNameLower.includes(ingLower.split(" ")[0]))
        );
      });
    })
    .slice(0, 3);

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

      {/* Back button — context-aware. Quiz visitors get sent back to
          their recommendations instead of the full product browser. */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px 0" }}>
        <Link
          href={fromQuiz ? "/quiz/results" : "/"}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#6b6560", textDecoration: "none" }}
        >
          ← {fromQuiz ? "Back to recommendations" : "Back to products"}
        </Link>
      </div>

      {/* Main product */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 32px" }}>
        <div className="product-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

          {/* Image */}
          <div style={{ position: "relative", width: "100%", height: "420px", background: "#f5f2ed", borderRadius: "20px", overflow: "hidden", border: "1px solid #e7e3dc" }}>
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: "contain" }} />
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

            {/* Buy now button */}
            <div style={{ marginBottom: "8px" }}>
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
            {product.affiliateUrl && (
              <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "16px", textAlign: "center" }}>
                You'll be redirected to our trusted retail partner. PureWell may earn a small commission at no extra cost to you.
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
              {[["🌿", "All natural"], ["✓", "Third-party tested"], ["↩", "30-day returns"]].map((badge) => (
                <div key={badge[1]} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{badge[0]}</div>
                  <div style={{ fontSize: "11px", color: "#6b6560", fontWeight: "500" }}>{badge[1]}</div>
                </div>
              ))}
            </div>

            {/* AI insight */}
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

        {/* Quiz nudge for undecided buyers. Suppressed when the
            user arrived from /quiz (?from=quiz) — they've already
            taken it, no need to suggest again. Soft banner styling
            (less prominent than the Buy button) so it reads as an
            alternative path, not a competing CTA.
            Designed to catch the wandering eye between reading the
            product details and bouncing — about ⅔ of the people
            who get this far without buying could benefit from a
            personalized recommendation. */}
        {!fromQuiz && (
          <div style={{ marginTop: "48px", background: "#fff", border: "1px solid #c8ddd0", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ width: "44px", height: "44px", background: "#eef5f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              💭
            </div>
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#2d2a24", marginBottom: "2px" }}>
                Not sure this is right for you?
              </div>
              <div style={{ fontSize: "13px", color: "#6b6560", lineHeight: 1.5 }}>
                Our 90-second AI wellness quiz builds a personalized protocol based on your goals — supplements and recipes that actually fit what you&apos;re working on.
              </div>
            </div>
            <Link
              href="/quiz"
              style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: 600, padding: "11px 20px", borderRadius: "10px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Take the quiz →
            </Link>
          </div>
        )}

        {/* Recipes that use this product. Inverse of the recipe
            page's ingredient → product linking — surfaces recipes
            that have this product (or a near-match) in their
            ingredient list. Drives users into the recipe content
            after looking at a product, increasing session depth. */}
        {usedInRecipes.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#2d2a24", marginBottom: "6px" }}>
              Use this in our recipes
            </h2>
            <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "16px" }}>
              Free DIY ways to put {product.name} to work — pulled from our recipe library.
            </p>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${usedInRecipes.length}, minmax(0, 1fr))`, gap: "12px" }}>
              {usedInRecipes.map((r) => {
                const rGoals = r.goals as string[];
                return (
                  <Link
                    key={r.id}
                    href={`/recipes/${r.slug}`}
                    style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "14px", padding: "14px", textDecoration: "none", display: "block" }}
                  >
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", background: "#f5f2ed", color: "#6b6560", padding: "2px 8px", borderRadius: "99px", fontWeight: 500, textTransform: "capitalize" }}>
                        {r.type}
                      </span>
                      {rGoals.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          style={{ fontSize: "10px", background: "#eef5f0", color: "#3d6b4f", padding: "2px 8px", borderRadius: "99px", fontWeight: 500, textTransform: "capitalize" }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#2d2a24", lineHeight: 1.3, marginBottom: "6px", textTransform: "capitalize" }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9c9488" }}>
                      {r.prepTime} min · ${r.costPerServing.toFixed(2)}/serving
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#2d2a24", marginBottom: "16px" }}>
              You might also like
            </h2>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {relatedProducts.map((related) => (
                <div key={related.id} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <Link href={`/products/${related.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ position: "relative", width: "100%", height: "140px", background: "#f5f2ed" }}>
                      {related.imageUrl ? (
                        <Image src={related.imageUrl} alt={related.name} fill style={{ objectFit: "contain" }} />
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5bfb5", fontSize: "12px" }}>
                          No image
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "12px 12px 0 12px" }}>
                      <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "2px" }}>{related.brand}</div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "8px", lineHeight: "1.3" }}>{related.name}</div>
                    </div>
                  </Link>
                  <div style={{ padding: "0 12px 12px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#2d2a24" }}>${related.price.toFixed(2)}</span>
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
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
import type { MetadataRoute } from "next";
import { db } from "../lib/db";

// Next.js auto-generates /sitemap.xml from this file at request time
// (because of the export below). On every crawl we read the latest
// product and recipe slugs from the DB so newly-added items are
// indexed without a redeploy — the alternative would be a static
// sitemap that goes stale every time content changes.
//
// changeFrequency / priority are hints, not directives; major
// crawlers (Google, Bing) mostly ignore them in favor of their own
// signals, but other crawlers do respect them, so we set them
// sensibly anyway.

const SITE_URL = "https://purewellnatural.com";

// Force dynamic so the sitemap is regenerated on every request,
// reflecting the latest products/recipes without a rebuild.
export const dynamic = "force-dynamic";
// Don't cache the sitemap itself for more than an hour — keeps
// search engines reasonably current without hammering the DB.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, recipes] = await Promise.all([
    db.product.findMany({ select: { slug: true, createdAt: true } }),
    db.recipe.findMany({ select: { slug: true, createdAt: true } }),
  ]);

  const now = new Date();

  // Static, hand-curated pages first. Priority 1.0 on the homepage
  // signals "most important" relative to other pages on the same site.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/recipes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/analyze`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const recipePages: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${SITE_URL}/recipes/${r.slug}`,
    lastModified: r.createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...recipePages];
}

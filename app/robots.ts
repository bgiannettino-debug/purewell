import type { MetadataRoute } from "next";

// Next.js auto-generates /robots.txt from this file. Search engines
// hit /robots.txt first to learn what they're allowed to crawl, so
// we explicitly disallow the admin dashboard (no point in indexing
// the product editor) and the raw API routes (they return JSON, not
// human-readable pages, and would just waste crawl budget).
//
// The sitemap pointer at the bottom is the formal way to tell
// crawlers where to find the full URL inventory — many crawlers will
// hit /sitemap.xml even without this, but advertising it speeds up
// discovery for less aggressive bots.

const SITE_URL = "https://purewellnatural.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/order-confirmed"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

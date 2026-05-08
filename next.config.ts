import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Whitelist of remote image hosts allowed by next/image. We use
    // `**.<domain>` wildcards so any subdomain of a trusted vendor works —
    // e.g. `images.unsplash.com`, `plus.unsplash.com`, and any future
    // `cdn.unsplash.com` all resolve under one entry.
    //
    // Important: Next.js's `**.example.com` matches subdomains but NOT the
    // apex. List the apex on its own line if you also want bare-domain URLs
    // to load (rare for image CDNs, but Unsplash and Thrive both serve some
    // imagery from the apex).
    //
    // Adding a new supplier? Drop in `**.<vendor>.com` (and the apex if
    // they serve images from it) — done. No more per-subdomain churn.
    remotePatterns: [
      // Unsplash — covers images.unsplash.com (standard CDN), plus.unsplash.com
      // (Unsplash+ paid tier), and the apex domain.
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },

      // Amazon — m.media-amazon.com is the current product CDN; the
      // ssl-images-amazon.com hosts (images-na, images-eu, etc.) still serve
      // a lot of legacy product imagery. They're separate domains, so we need
      // a wildcard for each.
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "**.ssl-images-amazon.com" },
      { protocol: "https", hostname: "ssl-images-amazon.com" },

      // iHerb — covers s3.images-iherb.com (primary) and images.iherb.com
      // (alternate on some product pages).
      { protocol: "https", hostname: "**.iherb.com" },

      // Thrive Market — product images live on a Cloudinary subdomain
      // (cdn.thrivemarket.com), with some served from the apex.
      { protocol: "https", hostname: "**.thrivemarket.com" },
      { protocol: "https", hostname: "thrivemarket.com" },

      // Stock photo CDNs — recipe imagery often comes from these.
      // iStock serves from media.* and images.* subdomains; Pexels and
      // Pixabay are free-license alternatives that come up often when
      // searching for recipe shots.
      { protocol: "https", hostname: "**.istockphoto.com" },
      { protocol: "https", hostname: "**.pexels.com" },
      { protocol: "https", hostname: "**.pixabay.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
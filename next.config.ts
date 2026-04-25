import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Whitelist of remote image hosts allowed by next/image. Adding a new
    // supplier? Add their image CDN(s) here so the product listing, cart,
    // and storefront grid don't 500 the moment you create a product.
    remotePatterns: [
      // Unsplash — for placeholder / editorial imagery.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },

      // Amazon — m.media-amazon.com is the current product CDN; the
      // ssl-images-amazon.com hosts still serve a lot of legacy product
      // imagery, so cover both.
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "images-eu.ssl-images-amazon.com" },
      { protocol: "https", hostname: "ssl-images-amazon.com" },

      // iHerb — s3.images-iherb.com is the primary; images.iherb.com is the
      // alternate seen on some product pages.
      { protocol: "https", hostname: "s3.images-iherb.com" },
      { protocol: "https", hostname: "images.iherb.com" },

      // Thrive Market — their product images live on a Cloudinary subdomain.
      { protocol: "https", hostname: "cdn.thrivemarket.com" },
      { protocol: "https", hostname: "thrivemarket.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
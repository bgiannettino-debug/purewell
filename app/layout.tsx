import type { Metadata, Viewport } from "next";
import "./globals.css";

// Explicit viewport export — without this, mobile browsers can render at
// desktop width and the page becomes a horizontally-scrolling mess. Pinning
// initial-scale to 1 also prevents iOS Safari from auto-zooming on form
// inputs with font-size < 16px (we use 13px in a few places).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "PureWell — Natural Health & Wellness",
    template: "%s | PureWell",
  },
  description: "Shop curated all-natural supplements, discover homemade wellness recipes, and get AI-powered health protocols. Third-party tested, non-GMO, and vegan options.",
  keywords: ["natural supplements", "wellness", "organic health", "herbal remedies", "DIY wellness recipes", "ashwagandha", "elderberry", "natural health"],
  authors: [{ name: "PureWell" }],
  creator: "PureWell",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://purewell-five.vercel.app",
    siteName: "PureWell",
    title: "PureWell — Natural Health & Wellness",
    description: "Shop curated all-natural supplements, discover homemade wellness recipes, and get AI-powered health protocols.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PureWell — Natural Health & Wellness",
    description: "Shop curated all-natural supplements, discover homemade wellness recipes, and get AI-powered health protocols.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
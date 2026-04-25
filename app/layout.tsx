import type { Metadata, Viewport } from "next";
import "./globals.css";

// Explicit viewport export — without this, mobile browsers can render at
// desktop width and the page becomes a horizontally-scrolling mess. Pinning
// initial-scale to 1 also prevents iOS Safari from auto-zooming on form
// inputs with font-size < 16px (we use 13px in a few places).
//
// themeColor pins the iOS Safari + Android Chrome URL bar tint to the
// announcement-bar green. Without this, Safari color-samples the topmost
// content and the URL bar changes shade as the user scrolls — particularly
// jarring with a sticky header where the topmost color stops shifting.
//
// Scoped to mobile viewports via the media query so desktop Safari/Chrome
// don't tint their toolbars green too. Above 768px the meta tag doesn't
// match and browsers fall back to their native (system / dark mode) chrome.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(max-width: 768px)", color: "#3d6b4f" },
  ],
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
    url: "https://purewellnatural.com",
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
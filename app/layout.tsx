import type { Metadata } from "next";
import "./globals.css";

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
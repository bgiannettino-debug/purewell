import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "PureWell affiliate disclosure and transparency statement.",
};

export default function DisclosurePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2d2a24", marginBottom: "8px" }}>
          Affiliate Disclosure
        </h1>
        <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "32px" }}>
          Last updated: April 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", marginBottom: "10px" }}>
              Our affiliate relationships
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8" }}>
              PureWell participates in affiliate marketing programs, including Amazon Associates and the iHerb Affiliate Program. This means that when you click on certain product links on our site and make a purchase, we may earn a small commission at no additional cost to you.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", marginBottom: "10px" }}>
              How this affects our recommendations
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8" }}>
              Our product recommendations are based on ingredient quality, third-party testing, clinical evidence, and our editorial standards — not on commission rates. We only recommend products we genuinely believe in. The affiliate commission we earn helps keep PureWell free for our users and allows us to continue creating educational wellness content.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", marginBottom: "10px" }}>
              Amazon Associates disclosure
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8" }}>
              PureWell is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate we earn from qualifying purchases.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", marginBottom: "10px" }}>
              iHerb affiliate disclosure
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8" }}>
              PureWell participates in the iHerb Affiliate Program. When you purchase products through our iHerb links we may earn a commission. iHerb maintains full control over pricing and product availability.
            </p>
          </div>

          <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", marginBottom: "10px" }}>
              Our commitment to you
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8" }}>
              Transparency is core to what we do. Every product recommendation on PureWell is made because we believe it meets our quality standards — not because of the commission it generates. If you ever have questions about our recommendations or affiliate relationships, contact us directly.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
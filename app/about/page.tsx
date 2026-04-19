import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PureWell",
  description: "PureWell is a curated natural health marketplace combining AI-powered wellness protocols with homemade recipes and third-party tested supplements.",
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "56px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "99px", marginBottom: "16px" }}>
            🌿 Our story
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#2d2a24", lineHeight: "1.25", marginBottom: "16px" }}>
            Natural wellness,<br />
            <span style={{ color: "#3d6b4f" }}>powered by science</span>
          </h1>
          <p style={{ fontSize: "15px", color: "#6b6560", lineHeight: "1.8", maxWidth: "520px", margin: "0 auto" }}>
            PureWell was built on a simple belief — that natural health products should be trustworthy, accessible, and backed by real evidence. No greenwashing. No mystery ingredients. Just clean, effective wellness.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", marginBottom: "64px" }} className="about-grid">
          <div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
              Our mission
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2d2a24", marginBottom: "14px", lineHeight: "1.3" }}>
              Making natural health simple and trustworthy
            </h2>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8", marginBottom: "14px" }}>
              The natural health industry is overwhelming. Thousands of products, conflicting claims, and no easy way to know what actually works. We built PureWell to cut through the noise.
            </p>
            <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.8" }}>
              Every product in our catalog is hand-selected, third-party tested where possible, and chosen based on clinical evidence — not marketing budgets.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { num: "26+", label: "Curated products" },
              { num: "8", label: "Free recipes" },
              { num: "100%", label: "All natural" },
              { num: "AI", label: "Powered protocols" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#3d6b4f", marginBottom: "4px" }}>{stat.num}</div>
                <div style={{ fontSize: "12px", color: "#9c9488" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: "64px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
              Our values
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2d2a24" }}>
              What we stand for
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }} className="values-grid">
            {[
              {
                icon: "🌿",
                title: "Genuinely natural",
                desc: "We only carry products with clean ingredient lists. No artificial fillers, synthetic dyes, or unnecessary additives. Ever.",
              },
              {
                icon: "🔬",
                title: "Evidence-based",
                desc: "Every recommendation is grounded in clinical research. We don't sell products based on trends — we sell based on science.",
              },
              {
                icon: "✓",
                title: "Third-party tested",
                desc: "We prioritize products verified by independent labs for potency, purity, and safety. What's on the label is what's in the bottle.",
              },
              {
                icon: "🤖",
                title: "AI-powered guidance",
                desc: "Our wellness quiz uses Claude AI to create personalized supplement protocols based on your specific health goals and lifestyle.",
              },
              {
                icon: "🏠",
                title: "DIY first",
                desc: "Many of the best wellness solutions can be made at home for pennies. Our free recipe library puts that knowledge in your hands.",
              },
              {
                icon: "💚",
                title: "Honest about limits",
                desc: "Natural products support wellness — they don't cure disease. We always include proper disclaimers and encourage you to work with your doctor.",
              },
            ].map((value) => (
              <div key={value.title} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{value.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d2a24", marginBottom: "6px" }}>{value.title}</div>
                <div style={{ fontSize: "13px", color: "#6b6560", lineHeight: "1.6" }}>{value.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "20px", padding: "40px", marginBottom: "64px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
              How it works
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2d2a24" }}>
              Your wellness journey with PureWell
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px" }} className="steps-grid">
            {[
              { step: "1", title: "Take the quiz", desc: "Answer 5 questions about your health goals and lifestyle" },
              { step: "2", title: "Get your plan", desc: "Our AI builds a personalized natural health protocol just for you" },
              { step: "3", title: "Shop or DIY", desc: "Order curated supplements or make your own remedies at home" },
              { step: "4", title: "Feel the difference", desc: "Track your progress and adjust your plan as you improve" },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#3d6b4f", margin: "0 auto 12px" }}>
                  {item.step}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d2a24", marginBottom: "6px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "#9c9488", lineHeight: "1.6" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality standards */}
        <div style={{ marginBottom: "64px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
              Our standards
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2d2a24" }}>
              How we select products
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="standards-grid">
            {[
              "Clean ingredient lists — no artificial fillers, binders, or synthetic dyes",
              "Preferably USDA Organic or Non-GMO Project Verified",
              "Third-party tested for potency and purity where available",
              "GMP (Good Manufacturing Practice) certified facilities",
              "Transparent labeling with clear dosage information",
              "Backed by peer-reviewed clinical research",
              "Vegan and gluten-free options clearly labeled",
              "Fair pricing relative to quality and efficacy",
            ].map((standard) => (
              <div key={standard} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "#fff", border: "1px solid #e7e3dc", borderRadius: "12px", padding: "14px" }}>
                <div style={{ width: "20px", height: "20px", background: "#eef5f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#3d6b4f" strokeWidth="1.5">
                    <path d="M2 5l2 2 4-4" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: "13px", color: "#6b6560", lineHeight: "1.5" }}>{standard}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#2d2a24", marginBottom: "10px" }}>
            Ready to start your wellness journey?
          </h2>
          <p style={{ fontSize: "14px", color: "#6b6560", marginBottom: "24px", lineHeight: "1.7" }}>
            Take our free AI wellness quiz and get a personalized natural health protocol in under 2 minutes.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quiz" style={{ background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px 28px", borderRadius: "12px", textDecoration: "none" }}>
              Take the wellness quiz →
            </Link>
            <Link href="/" style={{ background: "#fff", color: "#2d2a24", fontSize: "14px", fontWeight: "500", padding: "13px 28px", borderRadius: "12px", textDecoration: "none", border: "1px solid #e7e3dc" }}>
              Browse products
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .standards-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <Footer />
    </main>
  );
}
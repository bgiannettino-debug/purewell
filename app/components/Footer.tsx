import Link from "next/link";

export default function Footer() {
  const shopLinks = [
    { label: "All products", href: "/" },
    { label: "Supplements", href: "/?category=supplements" },
    { label: "Essential oils", href: "/?category=essential-oils" },
    { label: "Herbal teas", href: "/?category=herbal-teas" },
    { label: "Nutrition", href: "/?category=nutrition" },
    { label: "Skincare", href: "/?category=skincare" },
  ];

  const wellnessLinks = [
    { label: "Take the quiz", href: "/quiz" },
    { label: "DIY recipes", href: "/recipes" },
    { label: "Ashwagandha latte", href: "/recipes/ashwagandha-golden-sleep-latte" },
    { label: "Elderberry syrup", href: "/recipes/elderberry-immune-syrup" },
    { label: "Golden milk paste", href: "/recipes/turmeric-golden-milk-paste" },
    { label: "Immune shot", href: "/recipes/ginger-lemon-immune-shot" },
  ];

  const companyLinks = [
    { label: "About PureWell", href: "#" },
    { label: "Our standards", href: "#" },
    { label: "Contact us", href: "#" },
    { label: "Shipping policy", href: "#" },
    { label: "Return policy", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  const socialLinks = ["IG", "TK", "FB", "YT"];

  return (
    <footer style={{ background: "#2d2a24", color: "#c5bfb5", marginTop: "48px" }}>

      {/* Main grid */}
      <div className="footer-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 32px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px" }}></div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 32px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px" }}>

        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "32px", height: "32px", background: "#3d6b4f", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", lineHeight: "1" }}>
                pure<span style={{ color: "#6dbf8a" }}>well</span>
              </div>
              <div style={{ fontSize: "11px", color: "#9c9488", marginTop: "2px" }}>natural wellness</div>
            </div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#9c9488", maxWidth: "260px", marginBottom: "20px" }}>
            Curated all-natural supplements, homemade wellness recipes, and AI-powered health protocols.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {socialLinks.map((s) => (
              <div
                key={s}
                style={{ width: "32px", height: "32px", background: "#3d3a34", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "600", color: "#c5bfb5", cursor: "pointer" }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#fff", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>
            Shop
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {shopLinks.map((link) => (
              <Link key={link.label} href={link.href} style={{ fontSize: "13px", color: "#9c9488", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Wellness */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#fff", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>
            Wellness
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {wellnessLinks.map((link) => (
              <Link key={link.label} href={link.href} style={{ fontSize: "13px", color: "#9c9488", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#fff", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>
            Company
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {companyLinks.map((link) => (
              <Link key={link.label} href={link.href} style={{ fontSize: "13px", color: "#9c9488", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ borderTop: "1px solid #3d3a34", borderBottom: "1px solid #3d3a34" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "2px" }}>
              Join the PureWell community
            </div>
            <div style={{ fontSize: "12px", color: "#9c9488" }}>
              Weekly wellness tips, new recipes, and exclusive discounts.
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ padding: "9px 14px", fontSize: "13px", background: "#3d3a34", border: "1px solid #4d4a44", borderRadius: "10px", color: "#fff", outline: "none", width: "220px" }}
            />
            <button style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "9px 18px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom" style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}></div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ fontSize: "12px", color: "#6b6560" }}>
          2026 PureWell. All rights reserved.
        </div>
        <div style={{ fontSize: "11px", color: "#6b6560", maxWidth: "500px", textAlign: "right", lineHeight: "1.5" }}>
          These statements have not been evaluated by the FDA. Products are not intended to diagnose, treat, cure, or prevent any disease.
        </div>
      </div>

    </footer>
  );
}
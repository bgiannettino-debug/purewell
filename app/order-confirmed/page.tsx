import Link from "next/link";
import Navbar from "../components/Navbar";
import ClearCart from "../components/ClearCart";

export default function OrderConfirmed() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <ClearCart />
      <Navbar />

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{ width: "72px", height: "72px", background: "#eef5f0", border: "2px solid #c8ddd0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3d6b4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 16l7 7 13-13"/>
          </svg>
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#2d2a24", marginBottom: "8px" }}>
          Order confirmed!
        </h1>
        <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, marginBottom: "28px" }}>
          Thank you for your order. Your natural wellness products are on their way. Check your email for confirmation and tracking details.
        </p>

        {/* What happens next */}
        <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "12px" }}>
            What happens next
          </div>
          {[
            "Order confirmation email sent",
            "Your items ship within 1–2 business days",
            "Tracking number sent when your order ships",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "20px", height: "20px", background: "#eef5f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#3d6b4f" strokeWidth="1.5">
                  <path d="M2 5l2 2 4-4"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", color: "#6b6560" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Wellness tip */}
        <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "16px", padding: "16px", marginBottom: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
            While you wait
          </div>
          <p style={{ fontSize: "13px", color: "#3d6b4f", lineHeight: 1.6 }}>
            Try one of our free DIY wellness recipes — you can start your natural health journey today with ingredients you already have at home.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href="/"
            style={{ background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", textDecoration: "none", display: "block" }}
          >
            Continue shopping
          </Link>
          <Link
            href="/recipes"
            style={{ background: "#fff", color: "#2d2a24", fontSize: "13px", fontWeight: "500", padding: "11px", borderRadius: "12px", textDecoration: "none", display: "block", border: "1px solid #e7e3dc" }}
          >
            Browse free recipes
          </Link>
        </div>
      </div>
    </main>
  );
}
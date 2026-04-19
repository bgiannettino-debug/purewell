"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #e7e3dc" }}>
      {/* Announcement bar */}
      <div style={{ background: "#3d6b4f", color: "#fff", fontSize: "12px", textAlign: "center", padding: "8px 16px" }}>
        🌿 Free shipping on orders over $35 · All natural · Third-party tested
      </div>

      {/* Main nav */}
      <nav style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <div style={{ width: "32px", height: "32px", background: "#3d6b4f", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#2d2a24", lineHeight: 1 }}>
              pure<span style={{ color: "#3d6b4f" }}>well</span>
            </div>
            <div style={{ fontSize: "11px", color: "#9c9488", lineHeight: 1, marginTop: "2px" }}>
              natural wellness
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {[
            { href: "/?category=supplements", label: "Supplements" },
            { href: "/?category=essential-oils", label: "Essential oils" },
            { href: "/?category=herbal-teas", label: "Herbal teas" },
            { href: "/recipes", label: "Recipes" },
            { href: "/quiz", label: "Wellness quiz" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: "13px", color: "#5c5650", textDecoration: "none", fontWeight: "500" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", maxWidth: "280px" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <svg
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9c9488" }}
              width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <circle cx="5.5" cy="5.5" r="4"/>
              <line x1="9" y1="9" x2="13" y2="13"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ width: "100%", paddingLeft: "30px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13px", background: "#faf8f5", border: "1px solid #e7e3dc", borderRadius: "10px", outline: "none", color: "#2d2a24" }}
            />
          </div>
        </form>

        {/* Quiz CTA + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <Link
            href="/quiz"
            style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "8px 16px", borderRadius: "10px", textDecoration: "none" }}
          >
            Take the quiz
          </Link>
          <CartSidebar />
        </div>
      </nav>
    </header>
  );
}
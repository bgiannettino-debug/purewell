"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/");
    }
    setMenuOpen(false);
  };

  const navLinks = [
  { href: "/", label: "Products" },
  { href: "/recipes", label: "Recipes" },
  { href: "/analyze", label: "Label analyzer" },
  { href: "/quiz", label: "Wellness quiz" },
  { href: "/about", label: "About" },
  ];

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #e7e3dc" }}>
      {/* Announcement bar */}
      <div style={{ background: "#3d6b4f", color: "#fff", fontSize: "12px", textAlign: "center", padding: "8px 16px" }}>
        🌿 All natural · Third-party tested · AI-powered wellness recommendations
      </div>

      {/* Main nav. Padding is reduced on mobile via the .main-nav class
          below — 20px each side ate ~10% of an iPhone SE's width, which
          made the cart button look glued to the right edge. */}
      <nav className="main-nav" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Mobile hamburger — sits to the LEFT of the logo on mobile so it
            doesn't get pushed off the right edge by the cart button. Hidden
            on desktop (CSS at the bottom of this file flips it on at ≤768px). */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px", flexDirection: "column", gap: "5px", flexShrink: 0 }}
          className="mobile-menu-btn"
        >
          <div style={{ width: "22px", height: "2px", background: "#2d2a24", borderRadius: "1px" }} />
          <div style={{ width: "22px", height: "2px", background: "#2d2a24", borderRadius: "1px" }} />
          <div style={{ width: "22px", height: "2px", background: "#2d2a24", borderRadius: "1px" }} />
        </button>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ width: "38px", height: "38px", background: "#3d6b4f", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#2d2a24", lineHeight: "1" }}>
              pure<span style={{ color: "#3d6b4f" }}>well</span>
            </div>
            <div style={{ fontSize: "11px", color: "#9c9488", lineHeight: "1", marginTop: "2px" }}>
              natural wellness
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "14px", marginLeft: "24px" }}>
          {navLinks.flatMap((link, idx) => [
            idx > 0 ? (
              <div
                key={`sep-${link.href}`}
                aria-hidden
                style={{ width: "1px", height: "14px", background: "#e7e3dc" }}
              />
            ) : null,
            <Link key={link.href} href={link.href} style={{ fontSize: "12px", color: "#5c5650", textDecoration: "none", fontWeight: "500", whiteSpace: "nowrap" }}>
              {link.label}
            </Link>,
          ])}
        </div>

        <div style={{ flex: 1 }} />

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* Desktop search */}
          <form className="nav-search" onSubmit={handleSearch} style={{ display: "flex", width: "200px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9c9488" }} width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="5.5" cy="5.5" r="4" />
                <line x1="9" y1="9" x2="13" y2="13" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{ width: "100%", paddingLeft: "30px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13px", background: "#faf8f5", border: "1px solid #e7e3dc", borderRadius: "10px", outline: "none", color: "#2d2a24" }}
              />
            </div>
          </form>
          <Link href="/quiz" className="nav-links" style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "8px 16px", borderRadius: "10px", textDecoration: "none" }}>
            Take the quiz
          </Link>
          <CartSidebar />
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #e7e3dc", padding: "16px 24px" }}>
          <form onSubmit={handleSearch} style={{ marginBottom: "16px" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ width: "100%", padding: "10px 14px", fontSize: "14px", background: "#faf8f5", border: "1px solid #e7e3dc", borderRadius: "10px", outline: "none", color: "#2d2a24" }}
            />
          </form>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "14px", color: "#2d2a24", textDecoration: "none", fontWeight: "500", padding: "12px 0", borderBottom: "1px solid #f5f2ed" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-search { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .main-nav { padding: 10px 12px !important; gap: 8px !important; }
        }
      `}</style>
    </header>
  );
}
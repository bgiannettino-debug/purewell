"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SupplierMismatchWarning from "../../../components/SupplierMismatchWarning";

const categories = ["supplements", "essential-oils", "herbal-teas", "skincare", "nutrition", "fitness"];
const certificationOptions = ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free", "GMP Certified", "Third-party tested", "Kosher", "Fair Trade"];

const inputStyle = { width: "100%", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", color: "#2d2a24", background: "#faf8f5", boxSizing: "border-box" as const };
const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: "600" as const, color: "#6b6560", marginBottom: "5px" };

type Form = {
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  supplier: string;
  asin: string;
  certifications: string[];
};

const emptyForm: Form = {
  name: "",
  slug: "",
  brand: "",
  description: "",
  price: "",
  category: "supplements",
  imageUrl: "",
  affiliateUrl: "",
  supplier: "amazon",
  asin: "",
  certifications: [],
};

/**
 * Paste-and-extract import flow. Mirrors the new-product form but skips the
 * manual data entry: phase 1 collects the affiliate URL plus the page text,
 * phase 2 renders the same form pre-filled by Claude. Saves through the
 * existing /api/admin/products POST so the audit trail is identical.
 */
export default function ImportProductPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"paste" | "review">("paste");
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confidence, setConfidence] = useState<string>("");
  const [asinDetected, setAsinDetected] = useState(false);

  // Paste-phase inputs.
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [pageText, setPageText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Review-phase form, populated by the extraction call.
  const [form, setForm] = useState<Form>(emptyForm);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setExtracting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateUrl, pageText, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");
      setForm(data.draft);
      setConfidence(data.confidence);
      setAsinDetected(data.asinDetected);
      setPhase("review");
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setExtracting(false);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const toggleCert = (cert: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      router.push("/admin/products");
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setSaving(false);
    }
  };

  const startOver = () => {
    setPhase("paste");
    setForm(emptyForm);
    setConfidence("");
    setAsinDetected(false);
    setError("");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      {/* Header bar — matches the rest of the admin section */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "28px", height: "28px", background: "#3d6b4f", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
          </svg>
        </div>
        <span style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24" }}>
          pure<span style={{ color: "#3d6b4f" }}>well</span>
          <span style={{ fontSize: "12px", color: "#9c9488", fontWeight: "400", marginLeft: "6px" }}>Admin</span>
        </span>
        <div style={{ flex: 1 }} />
        <Link href="/admin/products" style={{ fontSize: "13px", color: "#6b6560", textDecoration: "none" }}>← Back</Link>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "4px" }}>
          {phase === "paste" ? "Import from Amazon" : "Review and save"}
        </h1>
        <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "20px" }}>
          {phase === "paste"
            ? "Paste an Amazon product link plus the page text. We'll extract the fields for you to review."
            : "Double-check the extracted fields, then save."}
        </p>

        {phase === "paste" && (
          <form onSubmit={handleExtract}>
            <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Amazon product URL</label>
                <input
                  style={inputStyle}
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="https://amzn.to/... or https://www.amazon.com/dp/..."
                  required
                />
                <div style={{ fontSize: "11px", color: "#9c9488", marginTop: "4px" }}>
                  Use your Amazon Associates affiliate link if you have it. We&apos;ll detect the ASIN automatically.
                </div>
              </div>

              <div>
                <label style={labelStyle}>Image URL</label>
                <input
                  style={inputStyle}
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://m.media-amazon.com/images/I/..."
                />
                <div style={{ fontSize: "11px", color: "#9c9488", marginTop: "4px" }}>
                  Right-click the main product photo on Amazon → Copy Image Address.
                </div>
              </div>

              <div>
                <label style={labelStyle}>Product page text</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: "180px", fontFamily: "monospace", fontSize: "12px" }}
                  value={pageText}
                  onChange={(e) => setPageText(e.target.value)}
                  placeholder="On the Amazon product page: Cmd+A to select all, Cmd+C to copy, then paste here. Don't worry about cleaning it up — we trim it for you."
                  required
                />
                <div style={{ fontSize: "11px", color: "#9c9488", marginTop: "4px" }}>
                  We use this to extract the title, brand, price, description, and certifications. Only the first ~12 KB is used.
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fdf0ee", border: "1px solid #f5c6c0", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#c0392b", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={extracting}
                style={{ flex: 1, background: extracting ? "#c5bfb5" : "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: extracting ? "not-allowed" : "pointer" }}
              >
                {extracting ? "Extracting..." : "Extract product →"}
              </button>
              <Link
                href="/admin/products"
                style={{ padding: "13px 20px", border: "1px solid #e7e3dc", borderRadius: "12px", fontSize: "13px", color: "#6b6560", textDecoration: "none", display: "flex", alignItems: "center" }}
              >
                Cancel
              </Link>
            </div>
          </form>
        )}

        {phase === "review" && (
          <form onSubmit={handleSave}>
            {/* Confidence banner — high confidence gets a quiet green note,
                medium/low gets a louder amber prompt to double-check fields. */}
            {confidence && (
              <div
                style={{
                  background: confidence === "high" ? "#eef5f0" : "#fef6e7",
                  border: `1px solid ${confidence === "high" ? "#c8ddd0" : "#f0d4a0"}`,
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: confidence === "high" ? "#3d6b4f" : "#8a6020",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "14px", lineHeight: 1, flexShrink: 0 }}>
                  {confidence === "high" ? "✓" : "⚠️"}
                </span>
                <div>
                  {confidence === "high"
                    ? "High-confidence extraction. Review and save."
                    : `${confidence === "low" ? "Low" : "Medium"}-confidence extraction — double-check the price, name, and certifications below before saving.`}
                  {!asinDetected && (
                    <div style={{ marginTop: "4px" }}>
                      Heads up: no ASIN was detected in the URL. The cart&apos;s Amazon checkout flow needs an ASIN to bundle this with other Amazon items — paste it manually below if you have it.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Product name</label>
                <input style={inputStyle} value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>URL slug</label>
                <input style={{ ...inputStyle, fontFamily: "monospace" }} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
              </div>
              <div>
                <label style={labelStyle}>Brand</label>
                <input style={inputStyle} value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} required />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Price ($)</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} type="url" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://m.media-amazon.com/images/I/..." />
              </div>
              <div>
                <label style={labelStyle}>Affiliate URL</label>
                <input style={inputStyle} type="url" value={form.affiliateUrl} onChange={(e) => setForm((p) => ({ ...p, affiliateUrl: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Supplier</label>
                  <select
                    style={inputStyle}
                    value={form.supplier}
                    onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))}
                  >
                    <option value="amazon">Amazon</option>
                    <option value="iherb">iHerb</option>
                    <option value="thrive">Thrive Market</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>ASIN (Amazon only)</label>
                  <input
                    style={inputStyle}
                    value={form.asin}
                    onChange={(e) => setForm((p) => ({ ...p, asin: e.target.value }))}
                    placeholder="e.g. B0009EYIQ4"
                  />
                </div>
              </div>
              <SupplierMismatchWarning
                affiliateUrl={form.affiliateUrl}
                supplier={form.supplier}
                onFix={(s) => setForm((p) => ({ ...p, supplier: s }))}
              />
            </div>

            <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px", marginBottom: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "12px" }}>Certifications</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {certificationOptions.map((cert) => {
                  const selected = form.certifications.includes(cert);
                  return (
                    <button key={cert} type="button" onClick={() => toggleCert(cert)}
                      style={{ padding: "9px 12px", borderRadius: "10px", border: selected ? "2px solid #3d6b4f" : "1px solid #e7e3dc", background: selected ? "#eef5f0" : "#faf8f5", cursor: "pointer", fontSize: "12px", fontWeight: "500", color: selected ? "#3d6b4f" : "#6b6560", textAlign: "left" }}>
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div style={{ background: "#fdf0ee", border: "1px solid #f5c6c0", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#c0392b", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{ flex: 1, background: saving ? "#c5bfb5" : "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", border: "none", cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Saving..." : "Save product →"}
              </button>
              <button
                type="button"
                onClick={startOver}
                style={{ padding: "13px 20px", border: "1px solid #e7e3dc", borderRadius: "12px", fontSize: "13px", color: "#6b6560", background: "#fff", cursor: "pointer" }}
              >
                Start over
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

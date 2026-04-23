"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Ingredient = {
  name: string;
  purpose: string;
  quality: "good" | "neutral" | "warning";
  note: string;
};

type Analysis = {
  productName: string;
  overallRating: number;
  overallVerdict: string;
  summary: string;
  ingredients: Ingredient[];
  redFlags: string[];
  positives: string[];
  recommendation: string;
  betterAlternative: string | null;
};

const qualityColors = {
  good: { bg: "#eef5f0", color: "#3d6b4f", border: "#c8ddd0" },
  neutral: { bg: "#fef6e7", color: "#8a6020", border: "#f0d4a0" },
  warning: { bg: "#fdf0ee", color: "#c0392b", border: "#f5c6c0" },
};

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
  if (file.size > 20 * 1024 * 1024) { setError("Image must be under 20MB."); return; }
  setFileName(file.name);
  setError("");
  setAnalysis(null);

  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 1024;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", 0.85);
      setImage(compressed);
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#3d6b4f";
    if (rating >= 6) return "#8a6020";
    return "#c0392b";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 8) return "Excellent";
    if (rating >= 6) return "Good";
    if (rating >= 4) return "Average";
    return "Poor";
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "40px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "99px", marginBottom: "14px" }}>
            🔬 AI-powered analysis
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2d2a24", marginBottom: "10px" }}>
            Supplement label analyzer
          </h1>
          <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: "1.7", maxWidth: "480px", margin: "0 auto" }}>
            Upload any supplement label and our AI instantly breaks down every ingredient — what it does, whether the dose is effective, and any red flags to watch out for.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: "#fff",
            border: `2px dashed ${image ? "#3d6b4f" : "#e7e3dc"}`,
            borderRadius: "16px",
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "16px",
            transition: "border-color 0.2s",
          }}
        >
          {image ? (
            <div>
              <img
                src={image}
                alt="Uploaded label"
                style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "8px", marginBottom: "12px", objectFit: "contain" }}
              />
              <div style={{ fontSize: "13px", color: "#3d6b4f", fontWeight: "500", marginBottom: "8px" }}>{fileName}</div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    style={{ fontSize: "12px", color: "#3d6b4f", background: "#eef5f0", border: "1px solid #c8ddd0", padding: "5px 12px", borderRadius: "8px", cursor: "pointer" }}
                    >
                      Change
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setFileName("");
                    setAnalysis(null);
                    setError("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                  style={{ fontSize: "12px", color: "#c0392b", background: "#fdf0ee", border: "1px solid #f5c6c0", padding: "5px 12px", borderRadius: "8px", cursor: "pointer" }}
                    >
                        Remove
                    </button>
                </div>
           </div>
          ) : (
            <div>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📷</div>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "6px" }}>
                Upload supplement label
              </div>
              <div style={{ fontSize: "13px", color: "#9c9488" }}>
                Click to upload or drag and drop · JPG, PNG, WEBP · Max 5MB
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {error && (
          <div style={{ background: "#fdf0ee", border: "1px solid #f5c6c0", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#c0392b", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {image && !loading && !analysis && (
          <button
            onClick={handleAnalyze}
            style={{ width: "100%", background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", marginBottom: "24px" }}
          >
            Analyze this supplement →
          </button>
        )}

        {loading && (
          <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid #eef5f0", borderTopColor: "#3d6b4f", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "6px" }}>
              Analyzing ingredients...
            </div>
            <div style={{ fontSize: "13px", color: "#9c9488" }}>
              Our AI is reviewing every ingredient for quality, dosage, and safety
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Overall rating */}
            <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "#9c9488", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Product analyzed
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#2d2a24" }}>
                    {analysis.productName}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "36px", fontWeight: "700", color: getRatingColor(analysis.overallRating), lineHeight: 1 }}>
                    {analysis.overallRating}
                    <span style={{ fontSize: "16px", color: "#9c9488" }}>/10</span>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: getRatingColor(analysis.overallRating) }}>
                    {getRatingLabel(analysis.overallRating)}
                  </div>
                </div>
              </div>
              <div style={{ background: "#f5f2ed", borderRadius: "8px", padding: "12px 16px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24", marginBottom: "4px" }}>
                  {analysis.overallVerdict}
                </div>
                <p style={{ fontSize: "13px", color: "#6b6560", lineHeight: "1.6", margin: 0 }}>
                  {analysis.summary}
                </p>
              </div>
            </div>

            {/* Red flags */}
            {analysis.redFlags.length > 0 && (
              <div style={{ background: "#fdf0ee", border: "1px solid #f5c6c0", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#c0392b", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  ⚠️ Red flags found
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {analysis.redFlags.map((flag, i) => (
                    <div key={i} style={{ fontSize: "13px", color: "#c0392b", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ flexShrink: 0 }}>•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positives */}
            {analysis.positives.length > 0 && (
              <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3d6b4f", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  ✓ What this product does well
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {analysis.positives.map((pos, i) => (
                    <div key={i} style={{ fontSize: "13px", color: "#3d6b4f", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ flexShrink: 0 }}>•</span>
                      <span>{pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients breakdown */}
            <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "16px" }}>
                Ingredient breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {analysis.ingredients.map((ing, i) => {
                  const colors = qualityColors[ing.quality];
                  return (
                    <div key={i} style={{ border: `1px solid ${colors.border}`, background: colors.bg, borderRadius: "10px", padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#2d2a24" }}>
                          {ing.name}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "500", color: colors.color, background: "#fff", padding: "2px 8px", borderRadius: "99px", border: `1px solid ${colors.border}` }}>
                          {ing.quality === "good" ? "✓ Good" : ing.quality === "warning" ? "⚠ Warning" : "~ Neutral"}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b6560", marginBottom: "3px" }}>
                        {ing.purpose}
                      </div>
                      <div style={{ fontSize: "12px", color: colors.color }}>
                        {ing.note}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24", marginBottom: "10px" }}>
                Our recommendation
              </div>
              <p style={{ fontSize: "13px", color: "#6b6560", lineHeight: "1.7", marginBottom: "16px" }}>
                {analysis.recommendation}
              </p>
              {analysis.betterAlternative && (
                <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#3d6b4f", marginBottom: "4px" }}>
                    Better alternative
                  </div>
                  <div style={{ fontSize: "13px", color: "#3d6b4f" }}>
                    {analysis.betterAlternative}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href="/"
                style={{ background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", textDecoration: "none", display: "block", textAlign: "center" }}
              >
                Shop better alternatives →
              </Link>
              <button
                onClick={() => { setAnalysis(null); setImage(null); setFileName(""); }}
                style={{ background: "#fff", color: "#6b6560", fontSize: "13px", fontWeight: "500", padding: "11px", borderRadius: "12px", border: "1px solid #e7e3dc", cursor: "pointer" }}
              >
                Analyze another supplement
              </button>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: "11px", color: "#9c9488", textAlign: "center", lineHeight: "1.6" }}>
              This analysis is for informational purposes only and has not been evaluated by the FDA. Always consult your healthcare provider before starting any supplement regimen.
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
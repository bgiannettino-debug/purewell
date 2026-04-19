"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ProtocolItem = {
  type: string;
  name: string;
  timing: string;
  reason: string;
  estimatedCost: string;
};

type Protocol = {
  protocolName: string;
  summary: string;
  items: ProtocolItem[];
  weeklyTip: string;
};

const timingColors: Record<string, { bg: string; color: string }> = {
  morning:   { bg: "#fef6e7", color: "#8a6020" },
  afternoon: { bg: "#eef3f8", color: "#4a6fa8" },
  evening:   { bg: "#f0eef8", color: "#6b5fa8" },
};

export default function ResultsPage() {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("purewell-protocol");
      if (!stored || stored === "undefined") { setError(true); return; }
      setProtocol(JSON.parse(stored));
    } catch { setError(true); }
  }, []);

  if (error) {
    return (
      <main style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌿</div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2a24", marginBottom: "8px" }}>Something went wrong</h1>
          <p style={{ fontSize: "14px", color: "#6b6560", marginBottom: "20px" }}>We couldn't generate your plan. Please try again.</p>
          <Link href="/quiz" style={{ background: "#3d6b4f", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "10px 20px", borderRadius: "10px", textDecoration: "none" }}>
            Try again
          </Link>
        </div>
      </main>
    );
  }

  if (!protocol) {
    return (
      <main style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: "2px solid #3d6b4f", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px", color: "#6b6560" }}>Building your wellness plan...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e7e3dc", padding: "14px 24px", display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#3d6b4f", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#2d2a24" }}>
            pure<span style={{ color: "#3d6b4f" }}>well</span>
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eef5f0", border: "1px solid #c8ddd0", color: "#3d6b4f", fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "99px", marginBottom: "14px" }}>
            ✓ Your AI wellness plan is ready
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#2d2a24", marginBottom: "10px" }}>
            {protocol.protocolName}
          </h1>
          <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7 }}>
            {protocol.summary}
          </p>
        </div>

        {/* Protocol items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {protocol.items.map((item, i) => {
            const timing = timingColors[item.timing] || { bg: "#f5f2ed", color: "#6b6560" };
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "14px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d2a24", marginBottom: "5px" }}>
                      {item.name}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{ fontSize: "11px", background: timing.bg, color: timing.color, padding: "3px 9px", borderRadius: "99px", fontWeight: "500", textTransform: "capitalize" }}>
                        {item.timing}
                      </span>
                      <span style={{ fontSize: "11px", background: "#f5f2ed", color: "#6b6560", padding: "3px 9px", borderRadius: "99px", fontWeight: "500", textTransform: "capitalize" }}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#3d6b4f", flexShrink: 0, marginLeft: "12px" }}>
                    {item.estimatedCost}
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "#6b6560", lineHeight: 1.6 }}>
                  {item.reason}
                </p>
              </div>
            );
          })}
        </div>

        {/* Weekly tip */}
        <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", color: "#3d6b4f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
            Weekly tip for you
          </div>
          <p style={{ fontSize: "13px", color: "#3d6b4f", lineHeight: 1.6 }}>
            {protocol.weeklyTip}
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ fontSize: "11px", color: "#9c9488", textAlign: "center", lineHeight: 1.6, marginBottom: "20px" }}>
          These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before starting any supplement regimen.
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/" style={{ background: "#3d6b4f", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "13px", borderRadius: "12px", textDecoration: "none", display: "block", textAlign: "center" }}>
            Shop these products →
          </Link>
          <Link href="/quiz" style={{ background: "#fff", color: "#2d2a24", fontSize: "13px", fontWeight: "500", padding: "11px", borderRadius: "12px", textDecoration: "none", display: "block", textAlign: "center", border: "1px solid #e7e3dc" }}>
            Retake the quiz
          </Link>
        </div>
      </div>
    </main>
  );
}
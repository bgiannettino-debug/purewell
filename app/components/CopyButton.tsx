"use client";

import { useState } from "react";

// Copy-to-clipboard button used on AI/structured content surfaces
// (recipes, label analyzer results, quiz protocols) so users can
// drop the output into Notes/Word/Mail/etc. without retyping.
//
// Uses the modern navigator.clipboard.writeText() API with a fallback
// to the legacy document.execCommand('copy') path for older browsers
// or non-HTTPS contexts. Shows a 2-second "Copied!" success state so
// the click feels acknowledged.

type Props = {
  text: string;
  // Optional label override; defaults to "Copy".
  label?: string;
  // "sm" = compact (default), "md" = larger for hero placements.
  size?: "sm" | "md";
  // Optional className for outer-wrapping styles.
  className?: string;
};

export default function CopyButton({ text, label = "Copy", size = "sm", className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older / non-HTTPS contexts.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isMd = size === "md";

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: copied ? "#eef5f0" : "#fff",
        color: copied ? "#3d6b4f" : "#6b6560",
        border: `1px solid ${copied ? "#c8ddd0" : "#e7e3dc"}`,
        borderRadius: "10px",
        padding: isMd ? "9px 14px" : "6px 10px",
        fontSize: isMd ? "13px" : "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7l3 3 7-7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="8" height="9" rx="1.5" />
            <path d="M2 10V3a1.5 1.5 0 011.5-1.5H10" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

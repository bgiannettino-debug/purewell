"use client";

import { useState } from "react";

// Reusable email-capture form. Lives on the quiz results page and on
// each recipe detail page — anywhere we have an artifact a visitor
// might want to come back to. Captures the email, sends a single
// transactional email (the protocol or recipe), and optionally adds
// the user to the marketing list when they tick the consent box.
//
// We intentionally don't ask for a name — every extra field cuts
// conversion. The transactional email is enough to verify intent;
// marketingOptIn is the only flag that matters for compliance.

type Props =
  | {
      type: "quiz-protocol";
      // The full protocol object (matches ProtocolEmailPayload in
      // lib/emailTemplates.ts). We pass it from the page rather than
      // re-fetching server-side so the email always reflects exactly
      // what the user is looking at.
      payload: unknown;
      referenceId?: string;
      label?: string;
      helperText?: string;
    }
  | {
      type: "recipe";
      payload: unknown;
      referenceId?: string;
      label?: string;
      helperText?: string;
    };

export default function EmailOptIn(props: Props) {
  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isRecipe = props.type === "recipe";
  const ctaLabel = props.label ?? (isRecipe ? "Email me this recipe" : "Email me this plan");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: props.type,
          payload: props.payload,
          marketingOptIn,
          referenceId: props.referenceId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Couldn't send the email. Please try again.");
        return;
      }
      setStatus("sent");
    } catch (err) {
      console.error("Email opt-in failed:", err);
      setStatus("error");
      setErrorMsg("Couldn't reach the server. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <div style={{ background: "#eef5f0", border: "1px solid #c8ddd0", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <span style={{ fontSize: "18px", lineHeight: 1, color: "#3d6b4f", flexShrink: 0 }}>✓</span>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#3d6b4f", marginBottom: "4px" }}>
            On its way to {email}
          </div>
          <div style={{ fontSize: "12px", color: "#3d6b4f", lineHeight: 1.5 }}>
            Check your inbox in the next minute or two — including the spam folder if you don&apos;t see it.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "14px", padding: "16px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2a24", marginBottom: "4px" }}>
        {isRecipe ? "Cook from your phone" : "Save this plan to your inbox"}
      </div>
      <div style={{ fontSize: "12px", color: "#9c9488", marginBottom: "12px", lineHeight: 1.5 }}>
        {props.helperText ??
          (isRecipe
            ? "We'll send the full recipe — ingredients and steps — straight to your inbox."
            : "We'll send your full protocol so you can revisit it anytime.")}
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: "14px",
            background: "#faf8f5",
            border: "1px solid #e7e3dc",
            borderRadius: "10px",
            outline: "none",
            color: "#2d2a24",
          }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            background: status === "sending" ? "#c5bfb5" : "#3d6b4f",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {status === "sending" ? "Sending…" : ctaLabel}
        </button>
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "11px", color: "#6b6560", lineHeight: 1.5, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => setMarketingOptIn(e.target.checked)}
          style={{ marginTop: "2px", flexShrink: 0 }}
        />
        <span>
          Also send me occasional wellness tips and new recipe ideas. Unsubscribe anytime.
        </span>
      </label>

      {status === "error" && errorMsg && (
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#c0392b" }}>{errorMsg}</div>
      )}
    </form>
  );
}

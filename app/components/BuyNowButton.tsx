"use client";

type Props = {
  affiliateUrl: string | null;
  fullWidth?: boolean;
};

export default function BuyNowButton({ affiliateUrl, fullWidth }: Props) {
  if (!affiliateUrl) {
    return (
      <span style={{ fontSize: "12px", color: "#9c9488" }}>
        Coming soon
      </span>
    );
  }

  return (
    
      <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#3d6b4f",
        color: "#fff",
        fontSize: fullWidth ? "14px" : "12px",
        fontWeight: "600",
        padding: fullWidth ? "13px 24px" : "6px 12px",
        borderRadius: fullWidth ? "12px" : "8px",
        textDecoration: "none",
        display: fullWidth ? "block" : "inline-block",
        textAlign: "center",
        whiteSpace: "nowrap" as const,
      }}
    >
      {fullWidth ? "Shop now \u2192" : "Buy"}
    </a>
  );
}

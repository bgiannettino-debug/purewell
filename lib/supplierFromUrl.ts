// Shared helper for inferring which supplier an affiliate URL points to.
// Used by the admin product form to warn when the supplier select drifts
// from the URL the merchandiser pasted in.

export type SupplierId = "amazon" | "iherb" | "other";

export const supplierLabels: Record<SupplierId, string> = {
  amazon: "Amazon",
  iherb: "iHerb",
  other: "Other",
};

/**
 * Returns the supplier id implied by an affiliate URL, based on its hostname.
 * Returns null if the URL is empty or unparseable so callers can opt out of
 * showing a warning until the user has actually entered something valid.
 */
export function detectSupplierFromUrl(url: string): SupplierId | null {
  if (!url || !url.trim()) return null;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  host = host.replace(/^www\./, "");

  // Amazon: covers amazon.com, amazon.co.uk, amazon.de, etc., plus the
  // shortened amzn.to / a.co domains used by Associates SiteStripe.
  if (
    host === "amzn.to" ||
    host === "a.co" ||
    host.endsWith(".amzn.to") ||
    host.endsWith(".a.co") ||
    /(^|\.)amazon\.[a-z.]+$/.test(host)
  ) {
    return "amazon";
  }

  // iHerb: iherb.com plus country domains.
  if (/(^|\.)iherb\.[a-z.]+$/.test(host)) {
    return "iherb";
  }

  return "other";
}

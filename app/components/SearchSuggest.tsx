"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Suggestion = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  imageUrl: string | null;
};

type Props = {
  placeholder?: string;
  // "navbar" is the slim 200px input in the header; "page" is the
  // wider variant for places like the mobile dropdown menu where the
  // input fills the row.
  variant?: "navbar" | "page";
  // Called after the user submits or selects a suggestion. The
  // navbar uses this to close the mobile dropdown menu, for example.
  onSubmit?: () => void;
};

// Wait 200ms after the last keystroke before firing the suggest API.
// Short enough to feel instant, long enough that we don't fire a
// request for every character of a fast typist.
const DEBOUNCE_MS = 200;

export default function SearchSuggest({
  placeholder = "Search products...",
  variant = "navbar",
  onSubmit,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks the latest fetch so out-of-order responses can't overwrite
  // a more recent one (the user types fast, network jitters, request
  // for "ashw" returns after request for "ashwa").
  const fetchSeqRef = useRef(0);

  // Fire the suggest API on every (debounced) query change.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const seq = ++fetchSeqRef.current;
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(trimmed)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        // Drop the response if a newer request has been kicked off in
        // the meantime — we don't want a stale list to flicker in.
        if (seq !== fetchSeqRef.current) return;
        setSuggestions(data.products || []);
      } catch (err) {
        console.warn("Search suggest failed", err);
      } finally {
        if (seq === fetchSeqRef.current) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close on outside click. Using mousedown instead of click so the
  // dropdown closes before any focus changes happen.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const submitFullSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    setIsOpen(false);
    onSubmit?.();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  const selectSuggestion = (s: Suggestion) => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
    onSubmit?.();
    router.push(`/products/${s.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isNavbar = variant === "navbar";
  const trimmedQuery = query.trim();
  const showDropdown = isOpen && trimmedQuery.length >= 2;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <form onSubmit={submitFullSearch} style={{ display: "flex", width: "100%" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <svg
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9c9488", pointerEvents: "none" }}
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="5.5" cy="5.5" r="4" />
            <line x1="9" y1="9" x2="13" y2="13" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            style={{
              width: "100%",
              paddingLeft: "30px",
              paddingRight: "12px",
              paddingTop: isNavbar ? "8px" : "10px",
              paddingBottom: isNavbar ? "8px" : "10px",
              fontSize: isNavbar ? "13px" : "14px",
              background: "#faf8f5",
              border: "1px solid #e7e3dc",
              borderRadius: "10px",
              outline: "none",
              color: "#2d2a24",
              boxSizing: "border-box",
            }}
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e7e3dc",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            zIndex: 100,
            overflow: "hidden",
            minWidth: isNavbar ? "300px" : "auto",
          }}
          role="listbox"
        >
          {loading && suggestions.length === 0 ? (
            <div style={{ padding: "14px 16px", fontSize: "12px", color: "#9c9488", textAlign: "center" }}>
              Searching…
            </div>
          ) : suggestions.length === 0 ? (
            <>
              <div style={{ padding: "14px 16px", fontSize: "12px", color: "#9c9488", textAlign: "center" }}>
                No products match &ldquo;{trimmedQuery}&rdquo;
              </div>
              <button
                onClick={() => submitFullSearch()}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  background: "#faf8f5",
                  border: "none",
                  borderTop: "1px solid #e7e3dc",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#3d6b4f",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                See full search results →
              </button>
            </>
          ) : (
            <>
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => selectSuggestion(s)}
                  onMouseEnter={() => setActiveIndex(i)}
                  role="option"
                  aria-selected={i === activeIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    width: "100%",
                    background: i === activeIndex ? "#faf8f5" : "transparent",
                    border: "none",
                    borderBottom: i < suggestions.length - 1 ? "1px solid #f0ece6" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ position: "relative", width: "36px", height: "36px", background: "#f5f2ed", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #e7e3dc" }}>
                    {s.imageUrl && (
                      <Image src={s.imageUrl} alt={s.name} fill style={{ objectFit: "cover" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "11px", color: "#9c9488", marginBottom: "1px" }}>{s.brand}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2a24", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.name}
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#2d2a24", flexShrink: 0 }}>
                    ${s.price.toFixed(2)}
                  </span>
                </button>
              ))}
              <button
                onClick={() => submitFullSearch()}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  background: "#faf8f5",
                  border: "none",
                  borderTop: "1px solid #e7e3dc",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#3d6b4f",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                See all results for &ldquo;{trimmedQuery}&rdquo; →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

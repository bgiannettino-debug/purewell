"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: "1px solid #e7e3dc", borderRadius: "20px", padding: "36px", width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "44px", height: "44px", background: "#3d6b4f", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
            </svg>
          </div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#2d2a24", marginBottom: "4px" }}>
            pure<span style={{ color: "#3d6b4f" }}>well</span>
          </div>
          <div style={{ fontSize: "13px", color: "#9c9488" }}>Admin dashboard</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#6b6560", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{ width: "100%", border: "1px solid #e7e3dc", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "#2d2a24", background: "#faf8f5", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ fontSize: "12px", color: "#c0392b", marginBottom: "12px", background: "#fdf0ee", border: "1px solid #f5c6c0", borderRadius: "8px", padding: "8px 12px" }}>
              Incorrect password. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{ width: "100%", background: password && !loading ? "#3d6b4f" : "#c5bfb5", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "12px", borderRadius: "10px", border: "none", cursor: password && !loading ? "pointer" : "not-allowed" }}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>
      </div>
    </main>
  );
}
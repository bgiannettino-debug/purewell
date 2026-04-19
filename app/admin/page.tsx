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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-xl font-medium mb-1">
            pure<span className="text-emerald-700">well</span>
          </div>
          <div className="text-sm text-gray-500">Admin dashboard</div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 mb-3">
              Incorrect password. Try again.
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>
      </div>
    </main>
  );
}
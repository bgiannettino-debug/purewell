"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header>
      {/* Top bar */}
      <div className="bg-stone-800 text-stone-200 text-xs text-center py-2 px-4">
        🌿 Free shipping on orders over $35 · All natural · Third-party tested
      </div>

      {/* Main nav */}
      <nav className="bg-stone-50 border-b border-stone-200 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2 Q11 5 11 9 Q8 13 5 9 Q5 5 8 2Z" fill="white"/>
                <path d="M8 6 Q10 8 10 10" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-semibold text-stone-800 leading-none">
                pure<span className="text-emerald-700">well</span>
              </div>
              <div className="text-xs text-stone-400 leading-none mt-0.5">
                natural wellness
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            <Link
              href="/?category=supplements"
              className="text-sm text-stone-600 hover:text-emerald-700 transition-colors font-medium"
            >
              Supplements
            </Link>
            <Link
              href="/?category=essential-oils"
              className="text-sm text-stone-600 hover:text-emerald-700 transition-colors font-medium"
            >
              Essential oils
            </Link>
            <Link
              href="/?category=herbal-teas"
              className="text-sm text-stone-600 hover:text-emerald-700 transition-colors font-medium"
            >
              Herbal teas
            </Link>
            <Link
              href="/recipes"
              className="text-sm text-stone-600 hover:text-emerald-700 transition-colors font-medium"
            >
              Recipes
            </Link>
            <Link
              href="/quiz"
              className="text-sm text-stone-600 hover:text-emerald-700 transition-colors font-medium"
            >
              Wellness quiz
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center gap-2 max-w-sm"
          >
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="5.5" cy="5.5" r="4"/>
                <line x1="9" y1="9" x2="13" y2="13"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search natural products..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-400 text-stone-700 placeholder-stone-400"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/quiz"
              className="hidden md:flex items-center gap-1.5 bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M7 1l1.2 3.5H12L9.4 6.7l1 3.3L7 8.2l-3.4 1.8 1-3.3L2 4.5h3.8z"/>
              </svg>
              Take the quiz
            </Link>
            <CartSidebar />
          </div>
        </div>
      </nav>
    </header>
  );
}
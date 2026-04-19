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

const timingColors: Record<string, string> = {
  morning: "bg-amber-50 text-amber-800",
  afternoon: "bg-blue-50 text-blue-800",
  evening: "bg-purple-50 text-purple-800",
};

export default function ResultsPage() {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("purewell-protocol");
      if (!stored || stored === "undefined") {
        setError(true);
        return;
      }
      const parsed = JSON.parse(stored);
      setProtocol(parsed);
    } catch (e) {
      console.error("Failed to parse protocol:", e);
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-5">
          <div className="text-4xl mb-4">🌿</div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            We couldn't generate your plan. This is usually an API credit issue.
          </p>
          <Link
            href="/quiz"
            className="bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl inline-block"
          >
            Try the quiz again
          </Link>
        </div>
      </main>
    );
  }

  if (!protocol) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your plan...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Your AI wellness plan is ready
          </div>
          <h1 className="text-2xl font-medium text-gray-900 mb-3">
            {protocol.protocolName}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {protocol.summary}
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {protocol.items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {item.name}
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        timingColors[item.timing] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.timing}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-emerald-700">
                  {item.estimatedCost}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.reason}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6">
          <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-2">
            Weekly tip for you
          </div>
          <p className="text-sm text-emerald-800 leading-relaxed">
            {protocol.weeklyTip}
          </p>
        </div>

        <div className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
          These statements have not been evaluated by the FDA. Not intended to
          diagnose, treat, cure, or prevent any disease. Consult your healthcare
          provider before starting any supplement regimen.
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl text-center hover:bg-emerald-700 transition-colors"
          >
            Shop these products →
          </Link>
          <Link
            href="/quiz"
            className="w-full border border-emerald-200 text-emerald-700 font-medium py-3 rounded-xl text-center hover:bg-emerald-50 transition-colors"
          >
            Retake the quiz
          </Link>
        </div>
      </div>
    </main>
  );
}
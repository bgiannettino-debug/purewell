import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Supplement Analyzer",
  description: "Upload any supplement label and get an instant AI-powered ingredient analysis.",
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

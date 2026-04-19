import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Wellness Plan Results",
  description: "Your personalized AI-powered natural health protocol based on your wellness goals.",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
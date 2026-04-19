import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Wellness Quiz — Get Your Personalized Health Plan",
  description: "Answer 5 quick questions and our AI will create a personalized natural health protocol matched to your specific goals. Free and takes 2 minutes.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
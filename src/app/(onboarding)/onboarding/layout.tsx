import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Set up your home profile to get personalized maintenance recommendations.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

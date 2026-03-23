import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Costs",
  description: "Track your home maintenance spending — estimated vs actual costs.",
};

export default function CostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

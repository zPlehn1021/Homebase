import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Your home maintenance calendar — see what's coming up and plan ahead.",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

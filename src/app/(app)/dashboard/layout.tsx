import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your home maintenance overview — tasks, reminders, and progress at a glance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

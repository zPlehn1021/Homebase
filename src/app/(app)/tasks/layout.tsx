import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tasks",
  description: "Manage your home maintenance tasks — view, complete, and track everything.",
};

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { TaskStatus, TaskCategory, SnoozeDuration } from "./types";

export function computeTaskStatus(
  dueDate: string | null,
  completedAt: string | null
): TaskStatus {
  if (completedAt) return "completed";
  if (!dueDate) return "upcoming";

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 7) return "due-soon";
  return "upcoming";
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function formatDueLabel(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < -1) return `${Math.abs(days)}d overdue`;
  if (days === -1) return "1d overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days}d`;
}

export function snoozeDueDate(
  currentDue: string,
  duration: SnoozeDuration
): string {
  const d = new Date(currentDue + "T00:00:00");
  switch (duration) {
    case "1w":
      d.setDate(d.getDate() + 7);
      break;
    case "2w":
      d.setDate(d.getDate() + 14);
      break;
    case "1mo":
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d.toISOString().split("T")[0];
}

export function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export const categoryIcons: Record<TaskCategory, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  hvac: "🌡️",
  exterior: "🏠",
  interior: "🪑",
  yard: "🌿",
  seasonal: "📅",
  appliances: "🔌",
  safety: "🛡️",
};

export const categoryColors: Record<TaskCategory, string> = {
  plumbing: "bg-blue-50 text-blue-700 border-blue-200",
  electrical: "bg-amber-50 text-amber-700 border-amber-200",
  hvac: "bg-orange-50 text-orange-700 border-orange-200",
  exterior: "bg-sage-50 text-sage-700 border-sage-200",
  interior: "bg-stone-100 text-stone-600 border-stone-300",
  yard: "bg-green-50 text-green-700 border-green-200",
  seasonal: "bg-sage-100 text-sage-700 border-sage-300",
  appliances: "bg-stone-50 text-stone-700 border-stone-200",
  safety: "bg-rose-50 text-rose-700 border-rose-200",
};

export const categoryBarColors: Record<TaskCategory, string> = {
  plumbing: "bg-blue-400",
  electrical: "bg-amber-400",
  hvac: "bg-orange-400",
  exterior: "bg-sage-500",
  interior: "bg-stone-400",
  yard: "bg-green-500",
  seasonal: "bg-sage-400",
  appliances: "bg-stone-500",
  safety: "bg-rose-400",
};

export const allCategories: TaskCategory[] = [
  "plumbing",
  "electrical",
  "hvac",
  "exterior",
  "interior",
  "yard",
  "seasonal",
  "appliances",
  "safety",
];

export const allFrequencies: { value: string; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annually", label: "Semi-Annually" },
  { value: "annually", label: "Annually" },
  { value: "one-time", label: "One-Time" },
];

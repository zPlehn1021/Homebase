import type { Task, TaskCompletion } from "@/lib/types";
import { computeTaskStatus } from "@/lib/utils";

export function CostSummaryCards({
  tasks,
  completions,
}: {
  tasks: Task[];
  completions: TaskCompletion[];
}) {
  const totalSpent = completions.reduce(
    (s, c) => s + (c.actualCost || 0),
    0
  );
  const estimatedRemaining = tasks
    .filter(
      (t) => computeTaskStatus(t.dueDate, t.completedAt) !== "completed"
    )
    .reduce((s, t) => s + (t.estimatedCost || 0), 0);
  const completionsWithCost = completions.filter(
    (c) => c.actualCost && c.actualCost > 0
  ).length;
  const avgCost =
    completionsWithCost > 0
      ? Math.round(totalSpent / completionsWithCost)
      : 0;

  const stats = [
    {
      label: "Total Spent",
      value: `$${totalSpent}`,
      icon: "💰",
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Est. Remaining",
      value: `$${estimatedRemaining}`,
      icon: "📊",
      color: "bg-amber-50 border-amber-200",
    },
    {
      label: "Avg. Per Task",
      value: `$${avgCost}`,
      icon: "📋",
      color: "bg-sage-50 border-sage-200",
    },
    {
      label: "Tasks Completed",
      value: completions.length.toString(),
      icon: "🧾",
      color: "bg-stone-50 border-stone-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border p-4 ${stat.color}`}
        >
          <span className="text-lg">{stat.icon}</span>
          <p className="text-2xl font-bold text-stone-800 tracking-tight mt-1">
            {stat.value}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

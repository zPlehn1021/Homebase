import type { Task } from "@/lib/types";
import { computeTaskStatus } from "@/lib/utils";

export function CostSummaryCards({ tasks }: { tasks: Task[] }) {
  const completed = tasks.filter(
    (t) => computeTaskStatus(t.dueDate, t.completedAt) === "completed"
  );
  const totalSpent = completed.reduce((s, t) => s + (t.actualCost || 0), 0);
  const estimatedRemaining = tasks
    .filter(
      (t) => computeTaskStatus(t.dueDate, t.completedAt) !== "completed"
    )
    .reduce((s, t) => s + (t.estimatedCost || 0), 0);
  const tasksWithCost = completed.filter(
    (t) => t.actualCost && t.actualCost > 0
  ).length;
  const avgCost = tasksWithCost > 0 ? Math.round(totalSpent / tasksWithCost) : 0;

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
      label: "Tasks With Costs",
      value: tasksWithCost.toString(),
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

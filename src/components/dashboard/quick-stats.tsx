import { MockTask } from "@/lib/mock-data";
import type { TaskCompletion } from "@/lib/types";

export function QuickStats({
  tasks,
  completions,
}: {
  tasks: MockTask[];
  completions: TaskCompletion[];
}) {
  const totalThisYear = tasks.length;
  const completedCount = completions.length;
  const completionRate =
    totalThisYear > 0 ? Math.round((completedCount / totalThisYear) * 100) : 0;
  const moneySpent = completions.reduce(
    (sum, c) => sum + (c.actualCost || 0),
    0
  );

  const stats = [
    {
      label: "Tasks This Year",
      value: totalThisYear.toString(),
      icon: "📋",
      color: "bg-sage-50 border-sage-200",
    },
    {
      label: "Completed",
      value: completedCount.toString(),
      icon: "✅",
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: "📊",
      color: "bg-amber-50 border-amber-200",
    },
    {
      label: "Spent This Year",
      value: `$${moneySpent}`,
      icon: "💰",
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">{stat.icon}</span>
          </div>
          <p className="text-2xl font-bold text-stone-800 tracking-tight">
            {stat.value}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

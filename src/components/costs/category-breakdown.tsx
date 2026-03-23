import type { Task, TaskCategory } from "@/lib/types";
import { categoryIcons, categoryBarColors, computeTaskStatus } from "@/lib/utils";

export function CategoryBreakdown({ tasks }: { tasks: Task[] }) {
  const completed = tasks.filter(
    (t) => computeTaskStatus(t.dueDate, t.completedAt) === "completed"
  );

  // Aggregate by category
  const categoryMap: Record<string, { count: number; cost: number }> = {};
  for (const t of completed) {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { count: 0, cost: 0 };
    }
    categoryMap[t.category].count++;
    categoryMap[t.category].cost += t.actualCost || 0;
  }

  const categories = Object.entries(categoryMap)
    .map(([cat, data]) => ({
      category: cat as TaskCategory,
      ...data,
    }))
    .sort((a, b) => b.cost - a.cost);

  const maxCost = Math.max(...categories.map((c) => c.cost), 1);

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-cream p-6 text-center">
        <p className="text-sm text-stone-400">
          No cost data yet. Complete some tasks to see your spending breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-cream p-5">
      <h3 className="text-sm font-semibold text-stone-600 mb-4">
        Spending by Category
      </h3>
      <div className="space-y-3">
        {categories.map(({ category, count, cost }) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{categoryIcons[category]}</span>
                <span className="text-sm font-medium text-stone-700 capitalize">
                  {category}
                </span>
                <span className="text-xs text-stone-400">
                  ({count} task{count !== 1 ? "s" : ""})
                </span>
              </div>
              <span className="text-sm font-semibold text-stone-700">
                ${cost}
              </span>
            </div>
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${categoryBarColors[category]}`}
                style={{ width: `${(cost / maxCost) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

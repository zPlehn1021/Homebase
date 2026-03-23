import type { Task } from "@/lib/types";
import { categoryIcons, formatDate, computeTaskStatus } from "@/lib/utils";

export function CompletedCostsList({ tasks }: { tasks: Task[] }) {
  const completed = tasks
    .filter(
      (t) => computeTaskStatus(t.dueDate, t.completedAt) === "completed"
    )
    .sort(
      (a, b) => (b.completedAt || "").localeCompare(a.completedAt || "")
    );

  if (completed.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-cream p-6 text-center">
        <p className="text-sm text-stone-400">
          No completed tasks with costs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-cream overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-600">
          Completed Tasks
        </h3>
      </div>
      <div className="divide-y divide-stone-100 max-h-[400px] overflow-y-auto">
        {completed.map((task) => {
          const estimated = task.estimatedCost || 0;
          const actual = task.actualCost || 0;
          const delta = actual - estimated;
          const hasComparison = estimated > 0 && actual > 0;

          return (
            <div
              key={task.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50/50 transition-colors"
            >
              <span className="text-lg shrink-0">
                {categoryIcons[task.category]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 truncate">
                  {task.title}
                </p>
                <p className="text-xs text-stone-400">
                  {task.completedAt && formatDate(task.completedAt)}
                </p>
              </div>
              <div className="text-right shrink-0">
                {actual > 0 ? (
                  <p className="text-sm font-semibold text-stone-700">
                    ${actual}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400">No cost</p>
                )}
                {hasComparison && (
                  <p
                    className={`text-xs font-medium ${
                      delta <= 0 ? "text-green-600" : "text-rose-500"
                    }`}
                  >
                    {delta <= 0 ? "▼" : "▲"} ${Math.abs(delta)} vs est.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

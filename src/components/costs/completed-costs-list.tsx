import type { TaskCompletion, TaskCategory } from "@/lib/types";
import { categoryIcons, formatDate } from "@/lib/utils";

export function CompletedCostsList({
  completions,
}: {
  completions: TaskCompletion[];
}) {
  if (completions.length === 0) {
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
        {completions.map((completion) => {
          const actual = completion.actualCost || 0;
          const icon =
            categoryIcons[completion.category as TaskCategory] || "📋";

          return (
            <div
              key={completion.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50/50 transition-colors"
            >
              <span className="text-lg shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 truncate">
                  {completion.title}
                </p>
                <p className="text-xs text-stone-400">
                  {formatDate(completion.completedAt.split("T")[0])}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

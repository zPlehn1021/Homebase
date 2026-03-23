"use client";

import { MockTask, categoryIcons } from "@/lib/mock-data";
import { inventoryCategoryIcons } from "@/lib/utils";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(dateStr: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function ComingUp({ tasks }: { tasks: MockTask[] }) {
  const upcoming = tasks
    .filter((t) => t.status === "upcoming")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-stone-800">
        Coming Up
      </h2>
      <div className="rounded-2xl border border-stone-200 bg-cream overflow-hidden divide-y divide-stone-100">
        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-stone-400 text-sm">
            No upcoming tasks in the next 30 days.
          </div>
        ) : (
          upcoming.map((task) => {
            const days = daysUntil(task.dueDate);
            return (
              <div
                key={task.id}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-stone-50/50 transition-colors cursor-pointer"
              >
                <span className="text-lg shrink-0">
                  {categoryIcons[task.category]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-stone-400 capitalize">
                    {task.category}
                    {task.estimatedCost ? ` · Est. $${task.estimatedCost}` : ""}
                  </p>
                  {task.linkedItems && task.linkedItems.length > 0 && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-stone-400">
                      <span>{inventoryCategoryIcons[task.linkedItems[0].category]}</span>
                      <span className="truncate">
                        {task.linkedItems[0].parentName ? `${task.linkedItems[0].parentName} → ` : ""}
                        {task.linkedItems[0].name}
                      </span>
                      {task.linkedItems.length > 1 && (
                        <span className="shrink-0">+{task.linkedItems.length - 1}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-stone-600">
                    {formatDate(task.dueDate)}
                  </p>
                  <p className="text-xs text-stone-400">
                    {days === 1 ? "tomorrow" : `in ${days} days`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

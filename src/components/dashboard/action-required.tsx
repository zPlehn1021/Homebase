"use client";

import { MockTask, categoryIcons } from "@/lib/mock-data";
import { inventoryCategoryIcons, formatCurrency } from "@/lib/utils";

function daysUntil(dateStr: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDueLabel(dateStr: string) {
  const days = daysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days}d`;
}

export function ActionRequired({ tasks }: { tasks: MockTask[] }) {
  const overdue = tasks.filter((t) => t.status === "overdue");
  const dueSoon = tasks.filter((t) => t.status === "due-soon");
  const actionTasks = [...overdue, ...dueSoon];

  if (actionTasks.length === 0) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
        <p className="text-green-700 font-medium">All caught up! No urgent tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-stone-800">
          Action Required
        </h2>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-600">
          {actionTasks.length}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actionTasks.map((task) => {
          const isOverdue = task.status === "overdue";
          return (
            <div
              key={task.id}
              className={`
                group relative rounded-2xl border p-4 transition-all duration-150 hover:shadow-md cursor-pointer
                ${
                  isOverdue
                    ? "bg-rose-50/60 border-rose-200 hover:border-rose-300"
                    : "bg-amber-50/60 border-amber-200 hover:border-amber-300"
                }
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xl leading-none">
                  {categoryIcons[task.category]}
                </span>
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                    ${
                      isOverdue
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  `}
                >
                  {formatDueLabel(task.dueDate)}
                </span>
              </div>
              <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-1">
                {task.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                {task.description}
              </p>
              {task.estimatedCost !== null && task.estimatedCost > 0 && (
                <p className="mt-2 text-xs text-stone-400">
                  Est. ${task.estimatedCost}
                </p>
              )}
              {task.linkedItems && task.linkedItems.length > 0 && (
                <div className="mt-2 space-y-1">
                  {task.linkedItems.slice(0, 1).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-1 text-[10px] text-stone-500"
                    >
                      <span>{inventoryCategoryIcons[item.category]}</span>
                      <span className="truncate">
                        {item.parentName ? `${item.parentName} → ` : ""}{item.name}
                      </span>
                      {item.partNumber && (
                        <span className="text-stone-400 font-mono shrink-0">{item.partNumber}</span>
                      )}
                      {item.purchaseCost != null && (
                        <span className="text-stone-400 shrink-0">{formatCurrency(item.purchaseCost)}</span>
                      )}
                    </div>
                  ))}
                  {task.linkedItems.length > 1 && (
                    <p className="text-[10px] text-stone-400">
                      +{task.linkedItems.length - 1} more item{task.linkedItems.length > 2 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

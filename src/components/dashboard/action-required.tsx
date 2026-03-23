import { MockTask, categoryIcons } from "@/lib/mock-data";

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
            </div>
          );
        })}
      </div>
    </div>
  );
}

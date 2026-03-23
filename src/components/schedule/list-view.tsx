import type { Task } from "@/lib/types";
import { categoryIcons, computeTaskStatus, formatDate } from "@/lib/utils";

const statusDotColors = {
  overdue: "bg-rose-400",
  "due-soon": "bg-amber-400",
  upcoming: "bg-sage-400",
  completed: "bg-green-400",
};

export function ListView({
  tasks,
  month,
  year,
}: {
  tasks: Task[];
  month: number;
  year: number;
}) {
  // Filter to current month and sort by date
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthTasks = tasks
    .filter((t) => t.dueDate?.startsWith(monthStr))
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));

  // Group by week
  const weeks: { label: string; tasks: Task[] }[] = [];
  let currentWeek: Task[] = [];
  let currentWeekStart = "";

  for (const task of monthTasks) {
    if (!task.dueDate) continue;
    const d = new Date(task.dueDate + "T00:00:00");
    const weekDay = d.getDay();
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - weekDay);
    const ws = weekStart.toISOString().split("T")[0];

    if (ws !== currentWeekStart) {
      if (currentWeek.length > 0) {
        weeks.push({
          label: `Week of ${formatDate(currentWeekStart)}`,
          tasks: currentWeek,
        });
      }
      currentWeek = [];
      currentWeekStart = ws;
    }
    currentWeek.push(task);
  }
  if (currentWeek.length > 0) {
    weeks.push({
      label: `Week of ${formatDate(currentWeekStart)}`,
      tasks: currentWeek,
    });
  }

  if (weeks.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-cream p-8 text-center">
        <p className="text-sm text-stone-400">No tasks scheduled this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {weeks.map((week, i) => (
        <div
          key={i}
          className="rounded-2xl border border-stone-200 bg-cream overflow-hidden"
        >
          <div className="px-4 py-2 border-b border-stone-100 bg-stone-50/50">
            <h3 className="text-xs font-semibold text-stone-500">
              {week.label}
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {week.tasks.map((task) => {
              const status = computeTaskStatus(task.dueDate, task.completedAt);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50/50 transition-colors"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${statusDotColors[status]}`}
                  />
                  <span className="text-lg shrink-0">
                    {categoryIcons[task.category]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        status === "completed"
                          ? "text-stone-400 line-through"
                          : "text-stone-700"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-stone-400 capitalize">
                      {task.category}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-stone-500 shrink-0">
                    {task.dueDate && formatDate(task.dueDate)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

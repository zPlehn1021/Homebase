import type { Task } from "@/lib/types";
import { categoryIcons, computeTaskStatus, formatDateLong } from "@/lib/utils";

const statusColors = {
  overdue: "text-rose-500",
  "due-soon": "text-amber-500",
  upcoming: "text-sage-600",
  completed: "text-green-600",
};

export function DayDetail({
  date,
  tasks,
  onClose,
}: {
  date: string;
  tasks: Task[];
  onClose: () => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-cream p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-800">
          {formatDateLong(date)}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l8 8M11 3L3 11" />
          </svg>
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-stone-400 py-3 text-center">
          No tasks scheduled for this day.
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const status = computeTaskStatus(task.dueDate, task.completedAt);
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors"
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
                  </p>
                </div>
                <span className={`text-xs font-semibold capitalize ${statusColors[status]}`}>
                  {status === "due-soon" ? "Due soon" : status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

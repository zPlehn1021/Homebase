import type { Task } from "@/lib/types";
import { computeTaskStatus } from "@/lib/utils";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusDotColors = {
  overdue: "bg-rose-400",
  "due-soon": "bg-amber-400",
  upcoming: "bg-sage-400",
  completed: "bg-green-400",
};

export function CalendarGrid({
  month,
  year,
  tasks,
  selectedDate,
  onSelectDate,
}: {
  month: number;
  year: number;
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Map tasks to dates
  const tasksByDate: Record<string, Task[]> = {};
  for (const task of tasks) {
    if (!task.dueDate) continue;
    if (!tasksByDate[task.dueDate]) tasksByDate[task.dueDate] = [];
    tasksByDate[task.dueDate].push(task);
  }

  const cells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month fill
  const prevMonth = new Date(year, month, 0);
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonth.getDate() - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({
      day: d,
      dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      isCurrentMonth: true,
    });
  }

  // Next month fill
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      cells.push({
        day: d,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: false,
      });
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-cream overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-stone-100">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-stone-400 py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dayTasks = tasksByDate[cell.dateStr] || [];
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`
                relative min-h-[72px] sm:min-h-[88px] p-1.5 border-b border-r border-stone-100 text-left transition-colors
                ${!cell.isCurrentMonth ? "bg-stone-50/50" : "hover:bg-stone-50"}
                ${isSelected ? "bg-sage-50 ring-2 ring-inset ring-sage-300" : ""}
              `}
            >
              <span
                className={`
                  inline-flex items-center justify-center text-xs w-6 h-6 rounded-full
                  ${
                    isToday
                      ? "bg-sage-600 text-white font-bold"
                      : cell.isCurrentMonth
                        ? "text-stone-700 font-medium"
                        : "text-stone-300"
                  }
                `}
              >
                {cell.day}
              </span>

              {/* Task dots */}
              {dayTasks.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-0.5 px-0.5">
                  {dayTasks.slice(0, 3).map((task, j) => {
                    const status = computeTaskStatus(
                      task.dueDate,
                      task.completedAt
                    );
                    return (
                      <span
                        key={j}
                        className={`w-1.5 h-1.5 rounded-full ${statusDotColors[status]}`}
                        title={task.title}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-stone-400 leading-none">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-stone-100 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-400" /> Overdue
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Due Soon
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sage-400" /> Upcoming
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Done
        </span>
      </div>
    </div>
  );
}

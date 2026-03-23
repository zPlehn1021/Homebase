const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function YearAtAGlance({
  tasksByMonth = {},
}: {
  tasksByMonth?: Record<number, { total: number; completed: number }>;
}) {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  return (
    <div className="rounded-2xl border border-stone-200 bg-cream p-5">
      <h3 className="text-sm font-semibold text-stone-600 mb-4">
        Year at a Glance
      </h3>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {monthLabels.map((label, i) => {
          const month = i + 1;
          const data = tasksByMonth[month] || { total: 0, completed: 0 };
          const isCurrentMonth = month === currentMonth;
          const allDone = data.total > 0 && data.completed === data.total;
          const hasUpcoming = data.total > 0 && data.completed < data.total;
          const isPast = month < currentMonth;

          let bgClass = "bg-stone-50 border-stone-200";
          let textClass = "text-stone-400";
          let dotClass = "";

          if (isCurrentMonth) {
            bgClass = "bg-sage-50 border-sage-300 ring-2 ring-sage-200";
            textClass = "text-sage-700 font-semibold";
          } else if (allDone) {
            bgClass = "bg-green-50 border-green-200";
            textClass = "text-green-700";
            dotClass = "bg-green-400";
          } else if (isPast && hasUpcoming) {
            bgClass = "bg-amber-50 border-amber-200";
            textClass = "text-amber-700";
            dotClass = "bg-amber-400";
          } else if (hasUpcoming) {
            dotClass = "bg-stone-300";
          }

          return (
            <div
              key={month}
              className={`
                flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-colors
                ${bgClass}
              `}
            >
              <span className={`text-xs ${textClass}`}>{label}</span>
              <span className={`text-xs font-medium mt-0.5 ${textClass}`}>
                {data.total}
              </span>
              {dotClass && (
                <span
                  className={`mt-1 w-1.5 h-1.5 rounded-full ${dotClass}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Complete
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sage-400" /> Current
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-stone-300" /> Upcoming
        </span>
      </div>
    </div>
  );
}

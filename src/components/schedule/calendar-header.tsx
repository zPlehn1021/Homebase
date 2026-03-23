const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarHeader({
  month,
  year,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: {
  month: number;
  year: number;
  viewMode: "calendar" | "list";
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (mode: "calendar" | "list") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-stone-800">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={onToday}
          className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-medium text-stone-500 hover:bg-stone-50 transition-colors"
        >
          Today
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 4L6 8l4 4" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>

        <div className="ml-2 flex rounded-xl border border-stone-200 overflow-hidden">
          <button
            onClick={() => onViewChange("calendar")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "calendar"
                ? "bg-sage-100 text-sage-700"
                : "text-stone-400 hover:bg-stone-50"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "list"
                ? "bg-sage-100 text-sage-700"
                : "text-stone-400 hover:bg-stone-50"
            }`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}

import type { TaskStatus } from "@/lib/types";

type TabValue = TaskStatus | "all";

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "All Tasks" },
  { value: "upcoming", label: "Upcoming" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

export function TaskTabs({
  active,
  onChange,
  counts,
}: {
  active: TabValue;
  onChange: (tab: TabValue) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        const count = counts[tab.value] || 0;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${
                isActive
                  ? "bg-sage-100 text-sage-800 shadow-sm"
                  : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              }
            `}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
                  ${
                    isActive
                      ? "bg-sage-200 text-sage-700"
                      : tab.value === "overdue"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-stone-200 text-stone-500"
                  }
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

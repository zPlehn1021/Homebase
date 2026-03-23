import type { TaskCategory } from "@/lib/types";
import { allCategories, categoryIcons } from "@/lib/utils";

export function CategoryFilter({
  active,
  onChange,
}: {
  active: TaskCategory | null;
  onChange: (category: TaskCategory | null) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
      <button
        onClick={() => onChange(null)}
        className={`
          px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border
          ${
            active === null
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-cream text-stone-500 border-stone-200 hover:border-stone-300"
          }
        `}
      >
        All
      </button>
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(active === cat ? null : cat)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border
            ${
              active === cat
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-cream text-stone-500 border-stone-200 hover:border-stone-300"
            }
          `}
        >
          <span className="text-sm">{categoryIcons[cat]}</span>
          <span className="capitalize">{cat}</span>
        </button>
      ))}
    </div>
  );
}

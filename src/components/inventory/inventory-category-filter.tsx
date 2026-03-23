"use client";

import type { InventoryCategory } from "@/lib/types";
import { inventoryCategoryIcons, allInventoryCategories } from "@/lib/utils";

export function InventoryCategoryFilter({
  active,
  onChange,
}: {
  active: InventoryCategory | null;
  onChange: (cat: InventoryCategory | null) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
          active === null
            ? "bg-sage-100 text-sage-800"
            : "text-stone-500 hover:bg-stone-100"
        }`}
      >
        All
      </button>
      {allInventoryCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(active === cat ? null : cat)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            active === cat
              ? "bg-sage-100 text-sage-800"
              : "text-stone-500 hover:bg-stone-100"
          }`}
        >
          {inventoryCategoryIcons[cat]}{" "}
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}

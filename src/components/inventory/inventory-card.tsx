"use client";

import type { InventoryItem } from "@/lib/types";
import {
  inventoryCategoryIcons,
  inventoryCategoryColors,
  conditionLabels,
  conditionColors,
  formatCurrency,
} from "@/lib/utils";

export function InventoryCard({
  item,
  onClick,
}: {
  item: InventoryItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-stone-200 p-4 hover:border-sage-300 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl text-lg ${
            inventoryCategoryColors[item.category]
          } border`}
        >
          {inventoryCategoryIcons[item.category]}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + condition */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-stone-800 truncate">
              {item.name}
            </h3>
            {item.condition && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                  conditionColors[item.condition]
                }`}
              >
                {conditionLabels[item.condition]}
              </span>
            )}
          </div>

          {/* Location / manufacturer */}
          <div className="flex items-center gap-2 mt-0.5">
            {item.location && (
              <span className="text-xs text-stone-400">{item.location}</span>
            )}
            {item.location && item.manufacturer && (
              <span className="text-xs text-stone-300">·</span>
            )}
            {item.manufacturer && (
              <span className="text-xs text-stone-400">{item.manufacturer}</span>
            )}
          </div>

          {/* Bottom row: model/part, cost, sub-item count */}
          <div className="flex items-center gap-3 mt-2">
            {item.modelNumber && (
              <span className="text-[11px] text-stone-400 font-mono">
                {item.modelNumber}
              </span>
            )}
            {item.purchaseCost && (
              <span className="text-[11px] text-stone-500 font-medium">
                {formatCurrency(item.purchaseCost)}
              </span>
            )}
            {(item.childCount ?? 0) > 0 && (
              <span className="text-[11px] text-sage-600 font-medium">
                {item.childCount} sub-item{item.childCount !== 1 ? "s" : ""}
              </span>
            )}
            {(item.linkedTaskCount ?? 0) > 0 && (
              <span className="text-[11px] text-amber-600 font-medium">
                {item.linkedTaskCount} task{item.linkedTaskCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-stone-300 mt-1 flex-shrink-0"
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
      </div>
    </button>
  );
}

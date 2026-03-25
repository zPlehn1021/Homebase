"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import type { HomebaseSession } from "@/lib/auth.d";
import type { Task, SnoozeDuration } from "@/lib/types";
import {
  categoryIcons,
  categoryColors,
  formatDate,
  formatDueLabel,
  computeTaskStatus,
  inventoryCategoryIcons,
  formatCurrency,
} from "@/lib/utils";

const statusBorderColors = {
  overdue: "border-l-rose-400",
  "due-soon": "border-l-amber-400",
  upcoming: "border-l-sage-400",
  completed: "border-l-green-400",
};

export function TaskCard({
  task,
  expanded,
  onToggle,
  onComplete,
  onSnooze,
  onDelete,
  onEdit,
}: {
  task: Task;
  expanded: boolean;
  onToggle: () => void;
  onComplete: (actualCost?: number) => void;
  onSnooze: (duration: SnoozeDuration) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const { data: rawSession } = useSession();
  const isPurchased = (rawSession as HomebaseSession | null)?.user?.purchaseVerified ?? true;
  const [actualCost, setActualCost] = useState(
    task.estimatedCost?.toString() || ""
  );
  const [showSnooze, setShowSnooze] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showUpgradeHint, setShowUpgradeHint] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const status = task.status || computeTaskStatus(task.dueDate, task.completedAt);
  const isCompleted = status === "completed";

  return (
    <div
      className={`
        rounded-2xl border border-stone-200 bg-cream border-l-4 transition-all duration-150
        ${statusBorderColors[status]}
        ${expanded ? "shadow-md" : "hover:shadow-sm"}
      `}
    >
      {/* Collapsed view */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 flex items-center gap-3"
      >
        <span className="text-lg shrink-0">{categoryIcons[task.category]}</span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold truncate ${isCompleted ? "text-stone-400 line-through" : "text-stone-800"}`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`inline-flex px-1.5 py-0.5 rounded text-xs border ${categoryColors[task.category]}`}
            >
              {task.category}
            </span>
            <span className="text-xs text-stone-400 capitalize">
              {task.frequency}
            </span>
          </div>
          {task.linkedItems && task.linkedItems.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {task.linkedItems.slice(0, 2).map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-[10px] text-stone-500 max-w-[200px]"
                >
                  <span className="shrink-0">{inventoryCategoryIcons[item.category]}</span>
                  <span className="truncate">
                    {item.parentName ? `${item.parentName} → ` : ""}{item.name}
                  </span>
                  {item.partNumber && (
                    <span className="text-stone-400 font-mono shrink-0">{item.partNumber}</span>
                  )}
                  {item.purchaseCost != null && (
                    <span className="text-stone-400 shrink-0">{formatCurrency(item.purchaseCost)}</span>
                  )}
                </span>
              ))}
              {task.linkedItems.length > 2 && (
                <span className="text-[10px] text-stone-400">
                  +{task.linkedItems.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          {task.dueDate && (
            <>
              <p className="text-xs font-medium text-stone-600">
                {formatDate(task.dueDate)}
              </p>
              {!isCompleted && (
                <p
                  className={`text-xs font-semibold ${
                    status === "overdue"
                      ? "text-rose-500"
                      : status === "due-soon"
                        ? "text-amber-500"
                        : "text-stone-400"
                  }`}
                >
                  {formatDueLabel(task.dueDate)}
                </p>
              )}
              {isCompleted && (
                <p className="text-xs text-green-600">Done ✓</p>
              )}
            </>
          )}
          {task.estimatedCost != null && task.estimatedCost > 0 && (
            <p className="text-xs text-stone-400 mt-0.5">
              ${task.estimatedCost}
            </p>
          )}
        </div>
        <svg
          className={`shrink-0 text-stone-300 transition-transform ${expanded ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Expanded view */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-stone-100 pt-3 space-y-3">
          {task.description && (
            <p className="text-sm text-stone-600 leading-relaxed">
              {task.description}
            </p>
          )}

          {task.notes && (
            <div>
              <p className="text-xs font-medium text-stone-500 mb-1">Notes</p>
              <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-2.5">
                {task.notes}
              </p>
            </div>
          )}

          {/* Cost info */}
          <div className="flex gap-4">
            {task.estimatedCost != null && (
              <div>
                <p className="text-xs text-stone-400">Estimated</p>
                <p className="text-sm font-medium text-stone-600">
                  ${task.estimatedCost}
                </p>
              </div>
            )}
            {task.actualCost != null && (
              <div>
                <p className="text-xs text-stone-400">Actual</p>
                <p className="text-sm font-medium text-green-600">
                  ${task.actualCost}
                </p>
              </div>
            )}
          </div>

          {/* Linked Inventory Items */}
          {task.linkedItems && task.linkedItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-stone-500 mb-1.5">Linked Items</p>
              <div className="space-y-1">
                {task.linkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-100"
                  >
                    <span className="text-sm">{inventoryCategoryIcons[item.category]}</span>
                    <span className="text-xs font-medium text-stone-700 truncate flex-1">
                      {item.parentName ? `${item.parentName} → ` : ""}{item.name}
                    </span>
                    {item.partNumber && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {item.partNumber}
                      </span>
                    )}
                    {item.purchaseCost != null && (
                      <span className="text-[10px] text-stone-400">
                        {formatCurrency(item.purchaseCost)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isCompleted && (
            <div className="flex flex-wrap gap-2 pt-1">
              {/* Purchase upgrade hint */}
              {showUpgradeHint && (
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between">
                  <p className="text-xs text-amber-800">
                    Purchase Homebase to mark tasks complete.
                  </p>
                  <Link
                    href="/pricing"
                    className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Upgrade
                  </Link>
                </div>
              )}

              {/* Mark Complete */}
              {!showComplete ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isPurchased) {
                      setShowUpgradeHint(true);
                      return;
                    }
                    setShowComplete(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sage-600 text-white text-xs font-medium hover:bg-sage-700 transition-colors"
                >
                  Mark Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-200">
                  <label className="text-xs text-stone-600">Actual cost:</label>
                  <span className="text-xs text-stone-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    className="w-20 px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete(
                        actualCost ? parseInt(actualCost, 10) : undefined
                      );
                      toast.success("Task completed!");
                    }}
                    className="px-2 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComplete(false);
                    }}
                    className="text-xs text-stone-400 hover:text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Edit */}
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-500 text-xs font-medium hover:bg-stone-50 transition-colors"
                >
                  Edit
                </button>
              )}
              {/* Snooze */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSnooze(!showSnooze);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-500 text-xs font-medium hover:bg-stone-50 transition-colors"
                >
                  Snooze
                </button>
                {showSnooze && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-stone-200 shadow-lg py-1 z-10 min-w-[120px]">
                    {(
                      [
                        { value: "1w", label: "1 week" },
                        { value: "2w", label: "2 weeks" },
                        { value: "1mo", label: "1 month" },
                      ] as { value: SnoozeDuration; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSnooze(opt.value);
                          setShowSnooze(false);
                          toast.success(`Task snoozed for ${opt.label}`);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete */}
              {onDelete && !showDeleteConfirm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-500 text-xs font-medium hover:bg-rose-50 transition-colors ml-auto"
                >
                  Delete
                </button>
              )}
              {onDelete && showDeleteConfirm && (
                <div className="flex items-center gap-2 ml-auto bg-rose-50 rounded-xl px-3 py-1.5 border border-rose-200">
                  <span className="text-xs text-rose-600">Delete this task?</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      toast.success("Task deleted");
                    }}
                    className="px-2 py-1 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(false);
                    }}
                    className="text-xs text-stone-400 hover:text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

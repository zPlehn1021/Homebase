"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import type { PreviewTask } from "@/lib/generate-tasks";
import type { TaskCategory } from "@/lib/types";
import { categoryIcons } from "@/lib/utils";

const categoryLabels: Record<TaskCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  hvac: "HVAC",
  exterior: "Exterior",
  interior: "Interior",
  yard: "Yard & Lawn",
  seasonal: "Seasonal",
  appliances: "Appliances",
  safety: "Safety",
};

const frequencyLabels: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  "semi-annually": "2x/year",
  annually: "Yearly",
  "one-time": "One-time",
};

export function StepTaskReview({
  propertyType,
  homeFeatures,
  excludedTitles,
  onExcludedChange,
  onNext,
  onBack,
}: {
  propertyType: string;
  homeFeatures: string[];
  excludedTitles: string[];
  onExcludedChange: (titles: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [allTasks, setAllTasks] = useState<PreviewTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Fetch preview tasks
  useEffect(() => {
    async function fetchPreview() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ propertyType });
        if (homeFeatures.length > 0) {
          params.set("homeFeatures", homeFeatures.join(","));
        }
        const res = await fetch(`/api/tasks/generate?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setAllTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch task preview:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPreview();
  }, [propertyType, homeFeatures]);

  // Group tasks by category
  const grouped = useMemo(() => {
    const groups: Record<string, PreviewTask[]> = {};
    for (const task of allTasks) {
      if (!groups[task.category]) groups[task.category] = [];
      groups[task.category].push(task);
    }
    // Sort categories by task count (descending)
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [allTasks]);

  const excludedSet = useMemo(() => new Set(excludedTitles), [excludedTitles]);
  const selectedCount = allTasks.length - excludedTitles.length;

  const toggleTask = useCallback(
    (title: string) => {
      if (excludedSet.has(title)) {
        onExcludedChange(excludedTitles.filter((t) => t !== title));
      } else {
        onExcludedChange([...excludedTitles, title]);
      }
    },
    [excludedSet, excludedTitles, onExcludedChange]
  );

  const toggleCategory = useCallback(
    (categoryTasks: PreviewTask[]) => {
      const titles = categoryTasks.map((t) => t.title);
      const allExcluded = titles.every((t) => excludedSet.has(t));
      if (allExcluded) {
        // Re-include all
        onExcludedChange(excludedTitles.filter((t) => !titles.includes(t)));
      } else {
        // Exclude all
        const newExcluded = new Set(excludedTitles);
        for (const t of titles) newExcluded.add(t);
        onExcludedChange(Array.from(newExcluded));
      }
    },
    [excludedSet, excludedTitles, onExcludedChange]
  );

  const selectAll = useCallback(() => onExcludedChange([]), [onExcludedChange]);
  const deselectAll = useCallback(
    () => onExcludedChange(allTasks.map((t) => t.title)),
    [allTasks, onExcludedChange]
  );

  const toggleCollapse = useCallback((category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center space-y-6 py-16">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sage-200 border-t-sage-600" />
        </div>
        <p className="text-lg font-semibold text-stone-800">
          Building your maintenance plan...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-stone-900">
          Review your plan
        </h2>
        <p className="text-sm text-stone-500">
          Uncheck any tasks you don&apos;t need. You can always add them back later.
        </p>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between bg-cream rounded-xl border border-stone-200 px-4 py-2.5">
        <p className="text-sm text-stone-600">
          <span className="font-bold text-sage-700">{selectedCount}</span>{" "}
          of {allTasks.length} tasks selected
        </p>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs font-medium text-sage-600 hover:text-sage-800 transition-colors"
          >
            Select All
          </button>
          <span className="text-stone-300">|</span>
          <button
            onClick={deselectAll}
            className="text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-3">
        {grouped.map(([category, categoryTasks]) => {
          const cat = category as TaskCategory;
          const selectedInCategory = categoryTasks.filter(
            (t) => !excludedSet.has(t.title)
          ).length;
          const allSelected = selectedInCategory === categoryTasks.length;
          const noneSelected = selectedInCategory === 0;
          const isCollapsed = collapsedCategories.has(category);

          return (
            <div
              key={category}
              className="rounded-xl border border-stone-200 overflow-hidden"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCollapse(category)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <span className="text-lg">{categoryIcons[cat]}</span>
                <span className="text-sm font-semibold text-stone-700 flex-1 text-left">
                  {categoryLabels[cat] || category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    noneSelected
                      ? "bg-stone-200 text-stone-500"
                      : "bg-sage-100 text-sage-700"
                  }`}
                >
                  {selectedInCategory}/{categoryTasks.length}
                </span>
                {/* Category toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(categoryTasks);
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                    allSelected ? "bg-sage-500" : noneSelected ? "bg-stone-300" : "bg-sage-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      allSelected || (!noneSelected && !allSelected)
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
                <svg
                  className={`shrink-0 text-stone-400 transition-transform ${isCollapsed ? "" : "rotate-180"}`}
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>

              {/* Task list */}
              {!isCollapsed && (
                <div className="divide-y divide-stone-100">
                  {categoryTasks.map((task) => {
                    const isSelected = !excludedSet.has(task.title);
                    return (
                      <label
                        key={task.title}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTask(task.title)}
                          className="w-4 h-4 rounded border-stone-300 text-sage-600 focus:ring-sage-500 shrink-0"
                        />
                        <span
                          className={`text-sm flex-1 ${
                            isSelected
                              ? "text-stone-700"
                              : "text-stone-400 line-through"
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs text-stone-400 shrink-0">
                          {frequencyLabels[task.frequency] || task.frequency}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
        >
          &larr; Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            selectedCount > 0
              ? "bg-sage-600 text-white hover:bg-sage-700 shadow-sm"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          }`}
        >
          Continue with {selectedCount} tasks &rarr;
        </button>
      </div>
    </div>
  );
}

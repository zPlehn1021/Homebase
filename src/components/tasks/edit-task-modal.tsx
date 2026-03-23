"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Task, UpdateTaskInput, TaskCategory, TaskFrequency, InventoryItem } from "@/lib/types";
import { allCategories, allFrequencies, categoryIcons, inventoryCategoryIcons, formatCurrency } from "@/lib/utils";
import { FocusTrap } from "@/components/ui/focus-trap";

export function EditTaskModal({
  task,
  onSubmit,
  onClose,
}: {
  task: Task;
  onSubmit: (id: number, input: UpdateTaskInput) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [frequency, setFrequency] = useState<TaskFrequency>(task.frequency);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [estimatedCost, setEstimatedCost] = useState(
    task.estimatedCost?.toString() || ""
  );
  const [notes, setNotes] = useState(task.notes || "");
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [linkedItems, setLinkedItems] = useState<InventoryItem[]>(
    task.linkedItems || []
  );

  useEffect(() => {
    fetch("/api/inventory?includeChildren=true")
      .then((r) => r.json())
      .then((data) => setAllItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const linkItem = async (itemId: number) => {
    const item = allItems.find((i) => i.id === itemId);
    if (!item || linkedItems.some((i) => i.id === itemId)) return;
    try {
      const res = await fetch(`/api/inventory/${itemId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id }),
      });
      if (!res.ok) throw new Error();
      setLinkedItems((prev) => [...prev, item]);
    } catch {
      toast.error("Failed to link item");
    }
  };

  const unlinkItem = async (itemId: number) => {
    try {
      const res = await fetch(
        `/api/inventory/${itemId}/links?taskId=${task.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setLinkedItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      toast.error("Failed to unlink item");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updates: UpdateTaskInput = {};
    if (title.trim() !== task.title) updates.title = title.trim();
    if (description.trim() !== (task.description || ""))
      updates.description = description.trim() || undefined;
    if (category !== task.category) updates.category = category;
    if (frequency !== task.frequency) updates.frequency = frequency;
    if (dueDate !== (task.dueDate || "")) updates.dueDate = dueDate;
    const newCost = estimatedCost ? parseInt(estimatedCost, 10) : undefined;
    if (newCost !== (task.estimatedCost ?? undefined))
      updates.estimatedCost = newCost;
    if (notes.trim() !== (task.notes || ""))
      updates.notes = notes.trim() || undefined;

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    toast.success("Task updated");
    onSubmit(task.id, updates);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit task"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <FocusTrap onEscape={onClose}>
        <div className="relative w-full max-w-lg bg-cream rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-800">Edit Task</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M4 4l10 10M14 4L4 14" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
            </div>

            {/* Category + Frequency row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as TaskCategory)
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryIcons[cat]}{" "}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(e.target.value as TaskFrequency)
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                >
                  {allFrequencies.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date + Cost row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Estimated Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any additional notes..."
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
            </div>

            {/* Linked Inventory Items */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Linked Inventory
              </label>
              {linkedItems.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {linkedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200"
                    >
                      <span className="text-sm">
                        {inventoryCategoryIcons[item.category]}
                      </span>
                      <span className="text-xs font-medium text-stone-700 truncate flex-1">
                        {item.name}
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
                      <button
                        type="button"
                        onClick={() => unlinkItem(item.id)}
                        className="p-0.5 rounded hover:bg-rose-50 text-stone-300 hover:text-rose-500"
                        aria-label={`Unlink ${item.name}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        >
                          <path d="M3 3l8 8M11 3l-8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {allItems.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    if (id) linkItem(id);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                >
                  <option value="">+ Link an inventory item...</option>
                  {allItems
                    .filter((item) => !linkedItems.some((l) => l.id === item.id))
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {inventoryCategoryIcons[item.category]} {item.name}
                        {item.partNumber ? ` (${item.partNumber})` : ""}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </div>
  );
}

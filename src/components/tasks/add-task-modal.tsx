"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { HomebaseSession } from "@/lib/auth.d";
import type { CreateTaskInput, TaskCategory, TaskFrequency } from "@/lib/types";
import { allCategories, allFrequencies, categoryIcons } from "@/lib/utils";
import { FocusTrap } from "@/components/ui/focus-trap";

export function AddTaskModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (input: CreateTaskInput) => void;
  onClose: () => void;
}) {
  const { data: rawSession } = useSession();
  const isPurchased = (rawSession as HomebaseSession | null)?.user?.purchaseVerified ?? true;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("interior");
  const [frequency, setFrequency] = useState<TaskFrequency>("one-time");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [estimatedCost, setEstimatedCost] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    toast.success("Task created");
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      dueDate,
      estimatedCost: estimatedCost ? parseInt(estimatedCost, 10) : undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add custom task">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <FocusTrap onEscape={onClose}>
      <div className="relative w-full max-w-lg bg-cream rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-800">
            Add Custom Task
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
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
              placeholder="e.g., Replace kitchen faucet"
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
              placeholder="What needs to be done..."
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
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
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

          {/* Actions */}
          {!isPurchased && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between">
              <p className="text-xs text-amber-800">
                Purchase Homebase to add custom tasks.
              </p>
              <Link
                href="/pricing"
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
              >
                Upgrade
              </Link>
            </div>
          )}
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
              disabled={!isPurchased}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isPurchased
                  ? "bg-sage-600 text-white hover:bg-sage-700"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
      </FocusTrap>
    </div>
  );
}

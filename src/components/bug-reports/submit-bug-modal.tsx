"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FocusTrap } from "@/components/ui/focus-trap";

export function SubmitBugModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (input: { title: string; description: string }) => Promise<unknown>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      });
      toast.success("Bug report submitted!");
      onClose();
    } catch {
      toast.error("Failed to submit bug report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Report a bug"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <FocusTrap onEscape={onClose}>
        <div className="relative w-full max-w-lg bg-cream rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-800">
              Report a Bug
            </h2>
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
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                placeholder="Brief summary of the bug"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
              />
              <p className="text-xs text-stone-400 mt-1">
                {title.length}/200
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={5000}
                rows={6}
                placeholder="Describe what happened, what you expected, and steps to reproduce..."
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
              <p className="text-xs text-stone-400 mt-1">
                {description.length}/5000
              </p>
            </div>

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
                disabled={submitting || !title.trim() || !description.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </div>
  );
}

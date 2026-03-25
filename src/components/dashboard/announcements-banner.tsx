"use client";

import type { Announcement } from "@/lib/types";

export function AnnouncementsBanner({
  announcements,
  onDismiss,
}: {
  announcements: Announcement[];
  onDismiss: (id: number) => void;
}) {
  if (announcements.length === 0) return null;

  return (
    <div className="space-y-2">
      {announcements.map((a) => (
        <div
          key={a.id}
          className="bg-sage-50 border border-sage-200 rounded-2xl p-4 relative"
        >
          <button
            onClick={() => onDismiss(a.id)}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-sage-100 text-sage-400 hover:text-sage-600 transition-colors"
            aria-label="Dismiss announcement"
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
          <div className="pr-8">
            <p className="text-sm font-semibold text-sage-800">{a.title}</p>
            <p className="text-xs text-sage-600 mt-1">{a.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

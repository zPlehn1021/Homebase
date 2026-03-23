"use client";

import { useState } from "react";

export function DataSection() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) throw new Error("Failed to export data");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download =
        filenameMatch?.[1] ||
        `homebase-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-cream rounded-2xl border border-stone-200 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Your Data</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Your data belongs to you. Export it anytime.
        </p>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed">
        Download a complete copy of your profile, tasks, and maintenance history
        as a JSON file. You can use this for your own records or to migrate your
        data.
      </p>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
      >
        {exporting ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Downloading...
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v8m0 0L5 7m3 3l3-3" />
              <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
            </svg>
            Export my data
          </>
        )}
      </button>
    </div>
  );
}

"use client";

import { useCallback } from "react";

export function useBugReports() {
  const submitReport = useCallback(
    async (input: { title: string; description: string }) => {
      const res = await fetch("/api/bug-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to submit bug report");
      return res.json();
    },
    []
  );

  return { submitReport };
}

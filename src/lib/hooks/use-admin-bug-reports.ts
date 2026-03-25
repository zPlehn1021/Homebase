"use client";

import { useState, useEffect, useCallback } from "react";
import type { BugReport } from "@/lib/types";

export function useAdminBugReports() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bug-reports");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const markFixed = async (id: number) => {
    const res = await fetch(`/api/bug-reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "fix" }),
    });
    if (!res.ok) throw new Error("Failed to mark fixed");
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "fixed" as const, resolvedAt: new Date().toISOString() }
          : r
      )
    );
  };

  return { reports, loading, markFixed, refetch: fetchReports };
}

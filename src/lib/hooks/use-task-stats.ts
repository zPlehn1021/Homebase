"use client";

import { useState, useEffect, useCallback } from "react";
import type { TaskStats } from "@/lib/types";

const defaultStats: TaskStats = {
  total: 0,
  overdue: 0,
  dueSoon: 0,
  upcoming: 0,
  completed: 0,
  totalEstimatedCost: 0,
  totalActualCost: 0,
  completionRate: 0,
  tasksByMonth: {},
  categoryBreakdown: [],
};

export function useTaskStats() {
  const [stats, setStats] = useState<TaskStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks/stats");
      if (res.status === 503) {
        // DB not configured — use defaults
        setStats(defaultStats);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}

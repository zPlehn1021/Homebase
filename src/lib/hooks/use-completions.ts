"use client";

import { useState, useEffect, useCallback } from "react";
import type { TaskCompletion } from "@/lib/types";

export function useCompletions() {
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletions = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks/completions");
      if (!res.ok) throw new Error("Failed to fetch completions");
      const data = await res.json();
      setCompletions(data);
    } catch {
      console.error("Failed to fetch completions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  return { completions, loading, refresh: fetchCompletions };
}

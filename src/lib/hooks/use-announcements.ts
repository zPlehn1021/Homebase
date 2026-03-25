"use client";

import { useState, useEffect, useCallback } from "react";
import type { Announcement } from "@/lib/types";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAnnouncements(data);
    } catch {
      // Silently fail — announcements are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const dismiss = async (id: number) => {
    // Optimistically remove
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/announcements/${id}/dismiss`, { method: "POST" });
    } catch {
      // Re-fetch on failure
      fetchAnnouncements();
    }
  };

  return { announcements, loading, dismiss };
}

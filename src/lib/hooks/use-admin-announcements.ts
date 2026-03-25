"use client";

import { useState, useEffect, useCallback } from "react";
import type { Announcement } from "@/lib/types";

export function useAdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements?scope=admin");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAnnouncements(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const createAnnouncement = async (input: {
    title: string;
    body: string;
  }) => {
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create");
    const created = await res.json();
    setAnnouncements((prev) => [created, ...prev]);
    return created;
  };

  const toggleAnnouncement = async (id: number, active: boolean) => {
    const res = await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    if (!res.ok) throw new Error("Failed to update");
    const updated = await res.json();
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );
  };

  const deleteAnnouncement = async (id: number) => {
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    announcements,
    loading,
    createAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements,
  };
}

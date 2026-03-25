"use client";

import { useState, useEffect, useCallback } from "react";
import type { FeatureRequest } from "@/lib/types";

export function useAdminFeatureRequests(
  scope: "pending" | "community_approved"
) {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feature-requests?scope=${scope}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const reviewRequest = async (
    id: number,
    action: "accept" | "deny" | "complete"
  ) => {
    const res = await fetch(`/api/feature-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error("Failed to review");
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return { requests, loading, reviewRequest, refetch: fetchRequests };
}

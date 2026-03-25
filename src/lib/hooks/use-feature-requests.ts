"use client";

import { useState, useEffect, useCallback } from "react";
import type { FeatureRequest } from "@/lib/types";

export function useFeatureRequests(scope: "voting" | "my") {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/feature-requests?scope=${scope}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFeatureRequests(data);
    } catch {
      setError("Failed to load feature requests");
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const submitRequest = async (input: {
    title: string;
    description: string;
  }): Promise<FeatureRequest | null> => {
    try {
      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to submit");
      const created = await res.json();
      if (scope === "my") {
        setFeatureRequests((prev) => [...prev, created]);
      }
      return created;
    } catch {
      setError("Failed to submit feature request");
      return null;
    }
  };

  const toggleVote = async (id: number) => {
    try {
      const res = await fetch(`/api/feature-requests/${id}/vote`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to vote");
      const { voted, voteCount } = await res.json();
      setFeatureRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, hasVoted: voted, voteCount } : r
        )
      );
    } catch {
      setError("Failed to vote");
    }
  };

  return {
    featureRequests,
    loading,
    error,
    submitRequest,
    toggleVote,
    refetch: fetchRequests,
  };
}

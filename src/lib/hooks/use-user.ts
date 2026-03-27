"use client";

import { useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  email: string;
  name: string;
  propertyType: string | null;
  homeAgeYears: number | null;
  squareFootage: number | null;
  homeFeatures: string[] | null;
  onboardingCompleted: boolean;
  purchaseVerified: boolean;
  hasDonated: boolean;
  emailReminders: boolean;
  reminderFrequency: string[] | null;
  weeklyDigest: boolean;
  createdAt: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUser = useCallback(
    async (updates: Partial<Omit<User, "id" | "email" | "createdAt">>) => {
      try {
        const res = await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update user");
        const data = await res.json();
        setUser(data);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      }
    },
    []
  );

  return { user, loading, error, updateUser, refetch: fetchUser };
}

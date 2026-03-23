"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  InventoryItem,
  InventoryCategory,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
} from "@/lib/types";

interface UseInventoryParams {
  search?: string;
  category?: InventoryCategory;
  parentId?: number | null;
}

export function useInventory(initialParams?: UseInventoryParams) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(
    async (params?: UseInventoryParams) => {
      setLoading(true);
      setError(null);

      const p = params || initialParams || {};
      const searchParams = new URLSearchParams();
      if (p.search) searchParams.set("search", p.search);
      if (p.category) searchParams.set("category", p.category);
      if (p.parentId !== undefined) {
        searchParams.set(
          "parentId",
          p.parentId === null ? "null" : String(p.parentId)
        );
      } else {
        // Default: top-level items only
        searchParams.set("parentId", "null");
      }

      try {
        const res = await fetch(`/api/inventory?${searchParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    },
    [initialParams]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (
    input: CreateInventoryItemInput
  ): Promise<InventoryItem | null> => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      return item;
    } catch {
      setError("Failed to create item");
      return null;
    }
  };

  const updateItem = async (
    id: number,
    input: UpdateInventoryItemInput
  ): Promise<InventoryItem | null> => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    } catch {
      setError("Failed to update item");
      return null;
    }
  };

  const deleteItem = async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i.id !== id));
      return true;
    } catch {
      setError("Failed to delete item");
      return false;
    }
  };

  const getItem = async (id: number): Promise<InventoryItem | null> => {
    try {
      const res = await fetch(`/api/inventory/${id}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      return await res.json();
    } catch {
      setError("Failed to load item");
      return null;
    }
  };

  const linkTask = async (
    itemId: number,
    taskId: number
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inventory/${itemId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      if (!res.ok) throw new Error("Failed to link task");
      return true;
    } catch {
      setError("Failed to link task");
      return false;
    }
  };

  const unlinkTask = async (
    itemId: number,
    taskId: number
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inventory/${itemId}/links?taskId=${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to unlink task");
      return true;
    } catch {
      setError("Failed to unlink task");
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    linkTask,
    unlinkTask,
  };
}

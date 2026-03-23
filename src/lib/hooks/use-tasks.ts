"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Task,
  TaskStatus,
  TaskCategory,
  CreateTaskInput,
  UpdateTaskInput,
  SnoozeDuration,
} from "@/lib/types";
import { computeTaskStatus } from "@/lib/utils";
import { mockTasks } from "@/lib/mock-data";

interface UseTasksParams {
  status?: TaskStatus | "all";
  category?: TaskCategory;
  search?: string;
}

function mockToTask(m: (typeof mockTasks)[0]): Task {
  return {
    id: m.id,
    userId: 1,
    title: m.title,
    description: m.description,
    category: m.category,
    frequency: "annually",
    dueDate: m.dueDate,
    completedAt: m.completedAt,
    isCustom: false,
    estimatedCost: m.estimatedCost,
    actualCost: m.actualCost,
    notes: null,
    createdAt: m.dueDate,
    status: m.status,
  };
}

export function useTasks(initialParams?: UseTasksParams) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchTasks = useCallback(
    async (params?: UseTasksParams) => {
      setLoading(true);
      setError(null);

      const p = params || initialParams || {};
      const searchParams = new URLSearchParams();
      if (p.status && p.status !== "all") searchParams.set("status", p.status);
      if (p.category) searchParams.set("category", p.category);
      if (p.search) searchParams.set("search", p.search);

      try {
        const res = await fetch(`/api/tasks?${searchParams.toString()}`);
        if (res.status === 503) {
          // DB not configured — fall back to mock data
          setUsingMockData(true);
          let mocked = mockTasks.map(mockToTask);
          if (p.status && p.status !== "all") {
            mocked = mocked.filter((t) => t.status === p.status);
          }
          if (p.category) {
            mocked = mocked.filter((t) => t.category === p.category);
          }
          if (p.search) {
            const s = p.search.toLowerCase();
            mocked = mocked.filter(
              (t) =>
                t.title.toLowerCase().includes(s) ||
                t.description?.toLowerCase().includes(s)
            );
          }
          setTasks(mocked);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
        // Fall back to mock data
        setUsingMockData(true);
        setTasks(mockTasks.map(mockToTask));
      } finally {
        setLoading(false);
      }
    },
    [initialParams, usingMockData]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (input: CreateTaskInput): Promise<Task | null> => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task = await res.json();
      task.status = computeTaskStatus(task.dueDate, task.completedAt);
      setTasks((prev) => [...prev, task]);
      return task;
    } catch {
      setError("Failed to create task");
      return null;
    }
  };

  const updateTask = async (
    id: number,
    input: UpdateTaskInput
  ): Promise<Task | null> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      updated.status = computeTaskStatus(updated.dueDate, updated.completedAt);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch {
      setError("Failed to update task");
      return null;
    }
  };

  const completeTask = async (
    id: number,
    actualCost?: number
  ): Promise<Task | null> => {
    return updateTask(id, { markComplete: true, actualCost });
  };

  const snoozeTask = async (
    id: number,
    duration: SnoozeDuration
  ): Promise<Task | null> => {
    return updateTask(id, { snoozeDuration: duration });
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch {
      setError("Failed to delete task");
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    usingMockData,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    snoozeTask,
    deleteTask,
  };
}

"use client";

import { useState, useMemo } from "react";
import { useTasks } from "@/lib/hooks/use-tasks";
import type { TaskStatus, TaskCategory } from "@/lib/types";
import { computeTaskStatus } from "@/lib/utils";
import { TaskTabs } from "@/components/tasks/task-tabs";
import { CategoryFilter } from "@/components/tasks/category-filter";
import { SearchBar } from "@/components/tasks/search-bar";
import { TaskCard } from "@/components/tasks/task-card";
import { AddTaskModal } from "@/components/tasks/add-task-modal";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function TasksPage() {
  const { tasks, loading, createTask, completeTask, snoozeTask, deleteTask, fetchTasks } =
    useTasks();
  const [activeTab, setActiveTab] = useState<TaskStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter tasks client-side for instant UI
  const filteredTasks = useMemo(() => {
    let filtered = tasks.map((t) => ({
      ...t,
      status: t.status || computeTaskStatus(t.dueDate, t.completedAt),
    }));

    if (activeTab !== "all") {
      filtered = filtered.filter((t) => t.status === activeTab);
    }
    if (categoryFilter) {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Sort: overdue first, then due-soon, then upcoming, then completed
    const statusOrder = { overdue: 0, "due-soon": 1, upcoming: 2, completed: 3 };
    filtered.sort((a, b) => {
      const sa = statusOrder[a.status!] ?? 2;
      const sb = statusOrder[b.status!] ?? 2;
      if (sa !== sb) return sa - sb;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      return 0;
    });

    return filtered;
  }, [tasks, activeTab, categoryFilter, searchQuery]);

  // Count tasks per tab
  const counts = useMemo(() => {
    const all = tasks.map((t) => ({
      ...t,
      status: t.status || computeTaskStatus(t.dueDate, t.completedAt),
    }));
    return {
      all: all.length,
      overdue: all.filter((t) => t.status === "overdue").length,
      "due-soon": all.filter((t) => t.status === "due-soon").length,
      upcoming: all.filter((t) => t.status === "upcoming").length,
      completed: all.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          My Tasks
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Tabs */}
      <TaskTabs active={activeTab} onChange={setActiveTab} counts={counts} />

      {/* Category filter */}
      <CategoryFilter active={categoryFilter} onChange={setCategoryFilter} />

      {/* Task list */}
      {loading ? (
        <LoadingSkeleton count={5} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={activeTab === "completed" ? "🎉" : "📋"}
          title={
            activeTab === "completed"
              ? "No completed tasks yet"
              : searchQuery
                ? "No tasks match your search"
                : "No tasks found"
          }
          description={
            activeTab === "completed"
              ? "Complete some tasks and they'll show up here."
              : "Try adjusting your filters or add a new task."
          }
          action={
            !searchQuery && activeTab === "all"
              ? { label: "Add a Task", onClick: () => setShowAddModal(true) }
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              expanded={expandedId === task.id}
              onToggle={() =>
                setExpandedId(expandedId === task.id ? null : task.id)
              }
              onComplete={(cost) => completeTask(task.id, cost)}
              onSnooze={(dur) => snoozeTask(task.id, dur)}
              onDelete={task.isCustom ? () => deleteTask(task.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          onSubmit={async (input) => {
            await createTask(input);
            setShowAddModal(false);
            fetchTasks();
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

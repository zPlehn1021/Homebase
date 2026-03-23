export type TaskCategory =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "exterior"
  | "interior"
  | "yard"
  | "seasonal"
  | "appliances"
  | "safety";

export type TaskFrequency =
  | "monthly"
  | "quarterly"
  | "semi-annually"
  | "annually"
  | "one-time";

export type TaskStatus = "overdue" | "due-soon" | "upcoming" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export type SnoozeDuration = "1w" | "2w" | "1mo";

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  category: TaskCategory;
  frequency: TaskFrequency;
  dueDate: string | null;
  completedAt: string | null;
  isCustom: boolean;
  estimatedCost: number | null;
  actualCost: number | null;
  notes: string | null;
  createdAt: string;
  // Computed client-side
  status?: TaskStatus;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  dueDate: string;
  estimatedCost?: number;
  notes?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategory;
  frequency?: TaskFrequency;
  dueDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  markComplete?: boolean;
  snoozeDuration?: SnoozeDuration;
}

export interface TaskStats {
  total: number;
  overdue: number;
  dueSoon: number;
  upcoming: number;
  completed: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  completionRate: number;
  tasksByMonth: Record<number, { total: number; completed: number }>;
  categoryBreakdown: {
    category: TaskCategory;
    count: number;
    totalCost: number;
  }[];
}

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
  // Joined data
  linkedItems?: InventoryItem[];
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

// ── Inventory types ─────────────────────────────────────────────

export type InventoryCategory =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "exterior"
  | "interior"
  | "appliances"
  | "safety"
  | "other";

export type ItemCondition =
  | "new"
  | "good"
  | "fair"
  | "poor"
  | "needs-replacement";

export type DocumentType = "warranty" | "manual" | "receipt" | "photo" | "other";

export interface InventoryItem {
  id: number;
  userId: number;
  parentId: number | null;
  name: string;
  description: string | null;
  category: InventoryCategory;
  location: string | null;
  manufacturer: string | null;
  modelNumber: string | null;
  serialNumber: string | null;
  partNumber: string | null;
  purchaseDate: string | null;
  purchaseCost: number | null;
  estimatedCost: number | null;
  warrantyExpiration: string | null;
  condition: ItemCondition | null;
  installDate: string | null;
  notes: string | null;
  customFields: { label: string; value: string }[] | null;
  createdAt: string;
  updatedAt: string;
  // Joined data
  children?: InventoryItem[];
  documents?: InventoryDocument[];
  linkedTasks?: Task[];
  childCount?: number;
  linkedTaskCount?: number;
  parentName?: string;
}

export interface InventoryDocument {
  id: number;
  inventoryItemId: number;
  userId: number;
  name: string;
  type: DocumentType;
  url: string;
  fileSize: number | null;
  mimeType: string | null;
  uploadedAt: string;
}

export interface CreateInventoryItemInput {
  name: string;
  description?: string;
  category: InventoryCategory;
  parentId?: number;
  location?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  partNumber?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  estimatedCost?: number;
  warrantyExpiration?: string;
  condition?: ItemCondition;
  installDate?: string;
  notes?: string;
  customFields?: { label: string; value: string }[];
}

export interface UpdateInventoryItemInput {
  name?: string;
  description?: string;
  category?: InventoryCategory;
  parentId?: number | null;
  location?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  partNumber?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  estimatedCost?: number;
  warrantyExpiration?: string;
  condition?: ItemCondition;
  installDate?: string;
  notes?: string;
  customFields?: { label: string; value: string }[];
}

// ── Feature Request types ────────────────────────────────────────

export type FeatureRequestStatus =
  | "pending"
  | "voting"
  | "community_approved"
  | "completed";

export interface FeatureRequest {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  createdAt: string;
  resolvedAt: string | null;
  voteCount?: number;
  hasVoted?: boolean;
  submitterName?: string;
  totalActiveUsers?: number;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  active: boolean;
}

// ── Bug Report types ────────────────────────────────────────────

export type BugReportStatus = "open" | "fixed";

export interface BugReport {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: BugReportStatus;
  createdAt: string;
  resolvedAt: string | null;
  submitterName?: string;
}

// ── Task types ──────────────────────────────────────────────────

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

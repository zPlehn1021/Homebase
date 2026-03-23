export type TaskStatus = "overdue" | "due-soon" | "upcoming" | "completed";
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
export type TaskPriority = "low" | "medium" | "high";

export interface MockTask {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedCost: number | null;
  actualCost: number | null;
  completedAt: string | null;
}

export const mockUser = {
  name: "Homeowner",
  email: "user@example.com",
  propertyType: "house" as const,
  homeAgeYears: 12,
  squareFootage: 2400,
  onboardingCompleted: true,
};

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const mockTasks: MockTask[] = [
  // Overdue
  {
    id: 1,
    title: "Change HVAC filters",
    description: "Replace or clean HVAC air filters for better air quality.",
    category: "hvac",
    dueDate: formatDate(addDays(today, -5)),
    status: "overdue",
    priority: "high",
    estimatedCost: 25,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 2,
    title: "Test sump pump",
    description: "Pour water into pit to trigger pump, verify correct drainage.",
    category: "plumbing",
    dueDate: formatDate(addDays(today, -2)),
    status: "overdue",
    priority: "high",
    estimatedCost: 0,
    actualCost: null,
    completedAt: null,
  },

  // Due this week
  {
    id: 3,
    title: "Inspect roof for damage",
    description: "Check for missing shingles, flashing issues, and leak signs.",
    category: "exterior",
    dueDate: formatDate(addDays(today, 2)),
    status: "due-soon",
    priority: "high",
    estimatedCost: 0,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 4,
    title: "Service air conditioning",
    description:
      "Schedule professional AC tune-up: clean coils, check refrigerant.",
    category: "hvac",
    dueDate: formatDate(addDays(today, 4)),
    status: "due-soon",
    priority: "high",
    estimatedCost: 150,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 5,
    title: "Check window and door screens",
    description: "Inspect screens for holes or damage before bug season.",
    category: "exterior",
    dueDate: formatDate(addDays(today, 5)),
    status: "due-soon",
    priority: "low",
    estimatedCost: 30,
    actualCost: null,
    completedAt: null,
  },

  // Upcoming (next 30 days)
  {
    id: 6,
    title: "Fertilize lawn",
    description: "Apply spring fertilizer to promote healthy grass growth.",
    category: "yard",
    dueDate: formatDate(addDays(today, 10)),
    status: "upcoming",
    priority: "medium",
    estimatedCost: 45,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 7,
    title: "Power wash siding and deck",
    description: "Pressure wash exterior siding and deck.",
    category: "exterior",
    dueDate: formatDate(addDays(today, 14)),
    status: "upcoming",
    priority: "medium",
    estimatedCost: 80,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 8,
    title: "Clean gutters and downspouts",
    description: "Remove debris from gutters, flush downspouts.",
    category: "exterior",
    dueDate: formatDate(addDays(today, 18)),
    status: "upcoming",
    priority: "high",
    estimatedCost: 0,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 9,
    title: "Test outdoor spigots",
    description: "Turn on outdoor faucets, check for freeze damage.",
    category: "plumbing",
    dueDate: formatDate(addDays(today, 21)),
    status: "upcoming",
    priority: "medium",
    estimatedCost: 0,
    actualCost: null,
    completedAt: null,
  },
  {
    id: 10,
    title: "Service lawn mower",
    description: "Change oil, replace spark plug, sharpen blade.",
    category: "yard",
    dueDate: formatDate(addDays(today, 25)),
    status: "upcoming",
    priority: "low",
    estimatedCost: 35,
    actualCost: null,
    completedAt: null,
  },

  // Completed this year
  {
    id: 11,
    title: "Test smoke & CO detectors",
    description: "Press test button on all detectors, replace batteries.",
    category: "safety",
    dueDate: "2026-01-15",
    status: "completed",
    priority: "high",
    estimatedCost: 20,
    actualCost: 18,
    completedAt: "2026-01-14",
  },
  {
    id: 12,
    title: "Inspect water heater",
    description: "Check for leaks, corrosion, and sediment.",
    category: "plumbing",
    dueDate: "2026-01-20",
    status: "completed",
    priority: "medium",
    estimatedCost: 0,
    actualCost: 0,
    completedAt: "2026-01-19",
  },
  {
    id: 13,
    title: "Inspect fire extinguishers",
    description: "Check pressure gauge, verify inspection tag date.",
    category: "safety",
    dueDate: "2026-01-25",
    status: "completed",
    priority: "high",
    estimatedCost: 0,
    actualCost: 0,
    completedAt: "2026-01-25",
  },
  {
    id: 14,
    title: "Check pipe insulation",
    description: "Verify exposed pipes are properly insulated.",
    category: "plumbing",
    dueDate: "2026-02-01",
    status: "completed",
    priority: "high",
    estimatedCost: 40,
    actualCost: 35,
    completedAt: "2026-02-01",
  },
  {
    id: 15,
    title: "Change HVAC filters (Feb)",
    description: "Monthly filter replacement.",
    category: "hvac",
    dueDate: "2026-02-15",
    status: "completed",
    priority: "high",
    estimatedCost: 25,
    actualCost: 22,
    completedAt: "2026-02-14",
  },
  {
    id: 16,
    title: "Deep clean dishwasher",
    description: "Clean filter, spray arms, and door gasket.",
    category: "appliances",
    dueDate: "2026-02-20",
    status: "completed",
    priority: "low",
    estimatedCost: 10,
    actualCost: 8,
    completedAt: "2026-02-20",
  },
  {
    id: 17,
    title: "Bleed radiators",
    description: "Release trapped air to restore even heating.",
    category: "hvac",
    dueDate: "2026-02-28",
    status: "completed",
    priority: "medium",
    estimatedCost: 0,
    actualCost: 0,
    completedAt: "2026-03-01",
  },
  {
    id: 18,
    title: "Change HVAC filters (Mar)",
    description: "Monthly filter replacement.",
    category: "hvac",
    dueDate: "2026-03-15",
    status: "completed",
    priority: "high",
    estimatedCost: 25,
    actualCost: 25,
    completedAt: "2026-03-15",
  },
];

// Tasks by month for the year-at-a-glance
export const tasksByMonth: Record<number, { total: number; completed: number }> = {
  1: { total: 4, completed: 4 },
  2: { total: 4, completed: 4 },
  3: { total: 3, completed: 1 },
  4: { total: 5, completed: 0 },
  5: { total: 2, completed: 0 },
  6: { total: 3, completed: 0 },
  7: { total: 2, completed: 0 },
  8: { total: 1, completed: 0 },
  9: { total: 4, completed: 0 },
  10: { total: 4, completed: 0 },
  11: { total: 2, completed: 0 },
  12: { total: 3, completed: 0 },
};

export const categoryIcons: Record<TaskCategory, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  hvac: "🌡️",
  exterior: "🏠",
  interior: "🪑",
  yard: "🌿",
  seasonal: "📅",
  appliances: "🔌",
  safety: "🛡️",
};

export const categoryColors: Record<TaskCategory, string> = {
  plumbing: "bg-blue-50 text-blue-700 border-blue-200",
  electrical: "bg-amber-50 text-amber-700 border-amber-200",
  hvac: "bg-orange-50 text-orange-700 border-orange-200",
  exterior: "bg-sage-50 text-sage-700 border-sage-200",
  interior: "bg-purple-50 text-purple-700 border-purple-200",
  yard: "bg-green-50 text-green-700 border-green-200",
  seasonal: "bg-cyan-50 text-cyan-700 border-cyan-200",
  appliances: "bg-stone-100 text-stone-700 border-stone-200",
  safety: "bg-rose-50 text-rose-700 border-rose-200",
};

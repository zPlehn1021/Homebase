"use client";

import { useTasks } from "@/lib/hooks/use-tasks";
import { computeTaskStatus } from "@/lib/utils";
import { ActionRequired } from "@/components/dashboard/action-required";
import { ComingUp } from "@/components/dashboard/coming-up";
import { SeasonalSummary } from "@/components/dashboard/seasonal-summary";
import { YearAtAGlance } from "@/components/dashboard/year-at-a-glance";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { AnnouncementsBanner } from "@/components/dashboard/announcements-banner";
import { StatsSkeleton, LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useUser } from "@/lib/hooks/use-user";
import { useAnnouncements } from "@/lib/hooks/use-announcements";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getSeasonalTip() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5)
    return "Spring is the perfect time to inspect your roof and service your AC before summer heat.";
  if (month >= 6 && month <= 8)
    return "Check your dryer vent and caulking around windows during the dry months.";
  if (month >= 9 && month <= 11)
    return "Time to winterize! Focus on outdoor faucets, furnace tune-ups, and weather stripping.";
  return "Winter is great for indoor tasks — test detectors, inspect the water heater, and check insulation.";
}

export default function DashboardPage() {
  const { tasks, loading } = useTasks();
  const { user } = useUser();
  const { announcements, dismiss: dismissAnnouncement } = useAnnouncements();
  const firstName = user?.name?.split(" ")[0] || "there";

  // Convert Task[] to MockTask-compatible shape for dashboard components
  const dashTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    category: t.category,
    dueDate: t.dueDate || "",
    status: t.status || computeTaskStatus(t.dueDate, t.completedAt),
    priority: "medium" as const,
    estimatedCost: t.estimatedCost,
    actualCost: t.actualCost,
    completedAt: t.completedAt,
    linkedItems: t.linkedItems,
  }));

  // Compute tasks by month for YearAtAGlance
  const tasksByMonth: Record<number, { total: number; completed: number }> = {};
  for (let m = 1; m <= 12; m++) {
    tasksByMonth[m] = { total: 0, completed: 0 };
  }
  for (const t of tasks) {
    if (t.dueDate) {
      const month = parseInt(t.dueDate.split("-")[1], 10);
      if (tasksByMonth[month]) {
        tasksByMonth[month].total++;
        if (t.completedAt) tasksByMonth[month].completed++;
      }
    }
  }

  // Compute seasonal progress
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  let seasonName = "Spring";
  let seasonEmoji = "🌱";
  let seasonMonths = [3, 4, 5];
  if (currentMonth >= 6 && currentMonth <= 8) {
    seasonName = "Summer";
    seasonEmoji = "☀️";
    seasonMonths = [6, 7, 8];
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    seasonName = "Fall";
    seasonEmoji = "🍂";
    seasonMonths = [9, 10, 11];
  } else if (currentMonth === 12 || currentMonth <= 2) {
    seasonName = "Winter";
    seasonEmoji = "❄️";
    seasonMonths = [12, 1, 2];
  }

  const seasonalTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const m = parseInt(t.dueDate.split("-")[1], 10);
    return seasonMonths.includes(m);
  });
  const seasonTotal = seasonalTasks.length;
  const seasonCompleted = seasonalTasks.filter((t) => t.completedAt).length;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-stone-500 max-w-xl">{getSeasonalTip()}</p>
      </div>

      {loading ? (
        <>
          <StatsSkeleton />
          <LoadingSkeleton count={3} />
        </>
      ) : (
        <>
          {/* Announcements */}
          <AnnouncementsBanner
            announcements={announcements}
            onDismiss={dismissAnnouncement}
          />

          {/* Quick Stats */}
          <QuickStats tasks={dashTasks} />

          {/* Action Required */}
          <ActionRequired tasks={dashTasks} />

          {/* Two-column layout for seasonal + year */}
          <div className="grid gap-4 lg:grid-cols-2">
            <SeasonalSummary
              season={seasonName}
              emoji={seasonEmoji}
              total={seasonTotal}
              completed={seasonCompleted}
            />
            <YearAtAGlance tasksByMonth={tasksByMonth} />
          </div>

          {/* Coming Up */}
          <ComingUp tasks={dashTasks} />
        </>
      )}
    </div>
  );
}

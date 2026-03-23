import { eq } from "drizzle-orm";
import { tasks } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { computeTaskStatus } from "@/lib/utils";
import type { TaskStats, TaskCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    let overdue = 0;
    let dueSoon = 0;
    let upcoming = 0;
    let completed = 0;
    let totalEstimatedCost = 0;
    let totalActualCost = 0;

    const tasksByMonth: Record<number, { total: number; completed: number }> =
      {};
    const categoryMap: Record<
      string,
      { count: number; totalCost: number }
    > = {};

    for (let m = 1; m <= 12; m++) {
      tasksByMonth[m] = { total: 0, completed: 0 };
    }

    for (const t of allTasks) {
      const status = computeTaskStatus(t.dueDate, t.completedAt);

      switch (status) {
        case "overdue":
          overdue++;
          break;
        case "due-soon":
          dueSoon++;
          break;
        case "upcoming":
          upcoming++;
          break;
        case "completed":
          completed++;
          break;
      }

      if (t.estimatedCost) totalEstimatedCost += t.estimatedCost;
      if (t.actualCost) totalActualCost += t.actualCost;

      // Tasks by month
      if (t.dueDate) {
        const month = parseInt(t.dueDate.split("-")[1], 10);
        if (tasksByMonth[month]) {
          tasksByMonth[month].total++;
          if (t.completedAt) tasksByMonth[month].completed++;
        }
      }

      // Category breakdown
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { count: 0, totalCost: 0 };
      }
      categoryMap[t.category].count++;
      if (t.actualCost) categoryMap[t.category].totalCost += t.actualCost;
    }

    const total = allTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, data]) => ({
        category: category as TaskCategory,
        count: data.count,
        totalCost: data.totalCost,
      }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const stats: TaskStats = {
      total,
      overdue,
      dueSoon,
      upcoming,
      completed,
      totalEstimatedCost,
      totalActualCost,
      completionRate,
      tasksByMonth,
      categoryBreakdown,
    };

    return Response.json(stats);
  } catch (error) {
    console.error("GET /api/tasks/stats error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

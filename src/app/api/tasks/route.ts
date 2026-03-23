import { NextRequest } from "next/server";
import { eq, like, and, gte, lte, or, asc } from "drizzle-orm";
import { tasks, users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { computeTaskStatus } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as TaskStatus | "all" | null;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const conditions = [eq(tasks.userId, userId)];

    if (category) {
      conditions.push(eq(tasks.category, category as typeof tasks.category.enumValues[number]));
    }
    if (search) {
      conditions.push(
        or(
          like(tasks.title, `%${search}%`),
          like(tasks.description, `%${search}%`)
        )!
      );
    }
    if (dateFrom) {
      conditions.push(gte(tasks.dueDate, dateFrom));
    }
    if (dateTo) {
      conditions.push(lte(tasks.dueDate, dateTo));
    }

    const results = await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(asc(tasks.dueDate));

    // Compute status for each task
    const tasksWithStatus = results.map((t) => ({
      ...t,
      status: computeTaskStatus(t.dueDate, t.completedAt),
    }));

    // Filter by computed status if requested
    if (status && status !== "all") {
      return Response.json(
        tasksWithStatus.filter((t) => t.status === status)
      );
    }

    return Response.json(tasksWithStatus);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    // Purchase verification guard
    const userResult = await db.select({ purchaseVerified: users.purchaseVerified }).from(users).where(eq(users.id, userId)).limit(1);
    if (userResult[0] && !userResult[0].purchaseVerified) {
      return Response.json({ error: "Purchase required to add tasks" }, { status: 403 });
    }

    const body = await request.json();

    const result = await db
      .insert(tasks)
      .values({
        userId,
        title: body.title,
        description: body.description || null,
        category: body.category,
        frequency: body.frequency,
        dueDate: body.dueDate,
        isCustom: true,
        estimatedCost: body.estimatedCost || null,
        notes: body.notes || null,
      })
      .returning();

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

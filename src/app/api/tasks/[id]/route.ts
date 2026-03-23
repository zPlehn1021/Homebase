import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { tasks, users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { snoozeDueDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;
    const { id } = await params;
    const taskId = parseInt(id, 10);
    const body = await request.json();

    // Fetch current task — scoped to authenticated user
    const current = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (current.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    // Mark complete — requires purchase verification
    if (body.markComplete) {
      const userResult = await db.select({ purchaseVerified: users.purchaseVerified }).from(users).where(eq(users.id, userId)).limit(1);
      if (userResult[0] && !userResult[0].purchaseVerified) {
        return Response.json({ error: "Purchase required to mark tasks complete" }, { status: 403 });
      }
      updates.completedAt = new Date().toISOString();
      if (body.actualCost !== undefined) {
        updates.actualCost = body.actualCost;
      }
    }

    // Snooze
    if (body.snoozeDuration && current[0].dueDate) {
      updates.dueDate = snoozeDueDate(current[0].dueDate, body.snoozeDuration);
    }

    // General field updates
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.frequency !== undefined) updates.frequency = body.frequency;
    if (body.dueDate !== undefined && !body.snoozeDuration)
      updates.dueDate = body.dueDate;
    if (body.estimatedCost !== undefined)
      updates.estimatedCost = body.estimatedCost;
    if (body.notes !== undefined) updates.notes = body.notes;

    if (Object.keys(updates).length === 0) {
      return Response.json(current[0]);
    }

    const result = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, taskId))
      .returning();

    return Response.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;
    const { id } = await params;
    const taskId = parseInt(id, 10);

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

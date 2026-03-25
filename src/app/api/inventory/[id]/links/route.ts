import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { inventoryItems, taskInventoryLinks, tasks } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { parseId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(
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
    const itemId = parseId(id);
    if (!itemId) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await request.json();

    // Verify inventory item ownership
    const item = await db
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.userId, userId)))
      .limit(1);

    if (item.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Verify task ownership
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, body.taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (task.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await db
      .insert(taskInventoryLinks)
      .values({ taskId: body.taskId, inventoryItemId: itemId });

    return Response.json({ linked: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory/[id]/links error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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
    const itemId = parseId(id);
    if (!itemId) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const taskId = parseId(searchParams.get("taskId") || "");
    if (!taskId) {
      return Response.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Verify inventory item ownership
    const item = await db
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.userId, userId)))
      .limit(1);

    if (item.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Verify task ownership
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (task.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await db
      .delete(taskInventoryLinks)
      .where(
        and(
          eq(taskInventoryLinks.taskId, taskId),
          eq(taskInventoryLinks.inventoryItemId, itemId)
        )
      );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/inventory/[id]/links error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

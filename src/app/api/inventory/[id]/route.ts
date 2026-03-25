import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  inventoryItems,
  inventoryDocuments,
  taskInventoryLinks,
  tasks,
} from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { parseId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(
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
    const itemId = parseId(id);
    if (!itemId) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const item = await db
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.userId, userId)))
      .limit(1);

    if (item.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Get children
    const children = await db
      .select()
      .from(inventoryItems)
      .where(
        and(eq(inventoryItems.parentId, itemId), eq(inventoryItems.userId, userId))
      );

    // Get documents
    const docs = await db
      .select()
      .from(inventoryDocuments)
      .where(eq(inventoryDocuments.inventoryItemId, itemId));

    // Get linked tasks
    const links = await db
      .select({ taskId: taskInventoryLinks.taskId })
      .from(taskInventoryLinks)
      .where(eq(taskInventoryLinks.inventoryItemId, itemId));

    let linkedTasks: unknown[] = [];
    if (links.length > 0) {
      const taskIds = links.map((l) => l.taskId);
      const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
      linkedTasks = allTasks.filter((t) => taskIds.includes(t.id));
    }

    return Response.json({
      ...item[0],
      children,
      documents: docs,
      linkedTasks,
    });
  } catch (error) {
    console.error("GET /api/inventory/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const itemId = parseId(id);
    if (!itemId) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await request.json();

    // Verify ownership
    const current = await db
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.userId, userId)))
      .limit(1);

    if (current.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    const fields = [
      "name",
      "description",
      "category",
      "parentId",
      "location",
      "manufacturer",
      "modelNumber",
      "serialNumber",
      "partNumber",
      "purchaseDate",
      "purchaseCost",
      "estimatedCost",
      "warrantyExpiration",
      "condition",
      "installDate",
      "notes",
      "customFields",
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(current[0]);
    }

    updates.updatedAt = new Date().toISOString();

    const result = await db
      .update(inventoryItems)
      .set(updates)
      .where(eq(inventoryItems.id, itemId))
      .returning();

    return Response.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/inventory/[id] error:", error);
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
    const itemId = parseId(id);
    if (!itemId) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Verify ownership
    const current = await db
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.userId, userId)))
      .limit(1);

    if (current.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Documents and task links cascade via FK, but children use plain parentId
    // so we must delete children explicitly first
    await db
      .delete(inventoryItems)
      .where(eq(inventoryItems.parentId, itemId));
    await db
      .delete(inventoryItems)
      .where(eq(inventoryItems.id, itemId));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/inventory/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

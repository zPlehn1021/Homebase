import { NextRequest } from "next/server";
import { eq, like, and, or, isNull, asc } from "drizzle-orm";
import { inventoryItems, users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import type { InventoryCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const category = searchParams.get("category") as InventoryCategory | null;
    const parentId = searchParams.get("parentId");
    const includeChildren = searchParams.get("includeChildren") === "true";

    const conditions = [eq(inventoryItems.userId, userId)];

    if (category) {
      conditions.push(
        eq(inventoryItems.category, category as typeof inventoryItems.category.enumValues[number])
      );
    }

    if (search) {
      conditions.push(
        or(
          like(inventoryItems.name, `%${search}%`),
          like(inventoryItems.description, `%${search}%`),
          like(inventoryItems.manufacturer, `%${search}%`),
          like(inventoryItems.modelNumber, `%${search}%`),
          like(inventoryItems.serialNumber, `%${search}%`),
          like(inventoryItems.partNumber, `%${search}%`)
        )!
      );
    }

    // If parentId is explicitly "null", show top-level only
    // If parentId is a number, show children of that item
    // If includeChildren is true, show all items (no parentId filter)
    if (!includeChildren) {
      if (parentId === null || parentId === "null") {
        conditions.push(isNull(inventoryItems.parentId));
      } else if (parentId) {
        conditions.push(eq(inventoryItems.parentId, parseInt(parentId, 10)));
      }
    }

    const results = await db
      .select()
      .from(inventoryItems)
      .where(and(...conditions))
      .orderBy(asc(inventoryItems.name));

    // Add child count for each item
    const allUserItems = await db
      .select({ id: inventoryItems.id, parentId: inventoryItems.parentId })
      .from(inventoryItems)
      .where(eq(inventoryItems.userId, userId));

    const childCounts = new Map<number, number>();
    for (const item of allUserItems) {
      if (item.parentId) {
        childCounts.set(item.parentId, (childCounts.get(item.parentId) || 0) + 1);
      }
    }

    const itemsWithCounts = results.map((item) => ({
      ...item,
      childCount: childCounts.get(item.id) || 0,
    }));

    return Response.json(itemsWithCounts);
  } catch (error) {
    console.error("GET /api/inventory error:", error);
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
    const userResult = await db
      .select({ purchaseVerified: users.purchaseVerified })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (userResult[0] && !userResult[0].purchaseVerified) {
      return Response.json(
        { error: "Purchase required to add inventory items" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const result = await db
      .insert(inventoryItems)
      .values({
        userId,
        parentId: body.parentId || null,
        name: body.name,
        description: body.description || null,
        category: body.category,
        location: body.location || null,
        manufacturer: body.manufacturer || null,
        modelNumber: body.modelNumber || null,
        serialNumber: body.serialNumber || null,
        partNumber: body.partNumber || null,
        purchaseDate: body.purchaseDate || null,
        purchaseCost: body.purchaseCost ?? null,
        estimatedCost: body.estimatedCost ?? null,
        warrantyExpiration: body.warrantyExpiration || null,
        condition: body.condition || null,
        installDate: body.installDate || null,
        notes: body.notes || null,
        customFields: body.customFields || null,
      })
      .returning();

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { inventoryItems, inventoryDocuments } from "@/db/schema";
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

    // Verify ownership
    const item = await db
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.userId, userId)))
      .limit(1);

    if (item.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docName = (formData.get("name") as string) || file?.name || "Untitled";
    const docType = (formData.get("type") as string) || "other";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`inventory/${userId}/${itemId}/${file.name}`, file, {
      access: "public",
    });

    const result = await db
      .insert(inventoryDocuments)
      .values({
        inventoryItemId: itemId,
        userId,
        name: docName,
        type: docType as typeof inventoryDocuments.type.enumValues[number],
        url: blob.url,
        fileSize: file.size,
        mimeType: file.type || null,
      })
      .returning();

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory/[id]/documents error:", error);
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
    const docId = parseId(searchParams.get("docId") || "");
    if (!docId) {
      return Response.json({ error: "Invalid document ID" }, { status: 400 });
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

    // Get doc to delete from blob storage
    const doc = await db
      .select()
      .from(inventoryDocuments)
      .where(
        and(
          eq(inventoryDocuments.id, docId),
          eq(inventoryDocuments.inventoryItemId, itemId)
        )
      )
      .limit(1);

    if (doc.length > 0 && doc[0].url) {
      try {
        await del(doc[0].url);
      } catch {
        // Blob may already be deleted; continue with DB cleanup
      }
    }

    await db
      .delete(inventoryDocuments)
      .where(
        and(
          eq(inventoryDocuments.id, docId),
          eq(inventoryDocuments.inventoryItemId, itemId)
        )
      );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/inventory/[id]/documents error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

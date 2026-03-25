import { getAdminUser } from "@/lib/admin-helpers";
import { featureRequests } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { parseId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db } = admin;
  const { id } = await params;
  const featureId = parseId(id);
  if (!featureId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json();
  const { action } = body;

  if (!["accept", "deny", "complete"].includes(action)) {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  // Get the current request
  const existing = await db
    .select()
    .from(featureRequests)
    .where(eq(featureRequests.id, featureId))
    .limit(1);

  if (!existing[0]) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const current = existing[0];

  if (action === "accept") {
    if (current.status !== "pending") {
      return Response.json(
        { error: "Can only accept pending requests" },
        { status: 400 }
      );
    }
    await db
      .update(featureRequests)
      .set({ status: "voting" })
      .where(eq(featureRequests.id, featureId));
    return Response.json({ success: true });
  }

  if (action === "deny") {
    if (current.status !== "pending") {
      return Response.json(
        { error: "Can only deny pending requests" },
        { status: 400 }
      );
    }
    await db
      .delete(featureRequests)
      .where(eq(featureRequests.id, featureId));
    return Response.json({ success: true });
  }

  if (action === "complete") {
    if (current.status !== "community_approved") {
      return Response.json(
        { error: "Can only complete community-approved requests" },
        { status: 400 }
      );
    }
    await db
      .update(featureRequests)
      .set({
        status: "completed",
        resolvedAt: sql`(datetime('now'))`,
      })
      .where(eq(featureRequests.id, featureId));
    return Response.json({ success: true });
  }
}

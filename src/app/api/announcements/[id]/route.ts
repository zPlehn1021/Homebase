import { getAdminUser } from "@/lib/admin-helpers";
import { announcements } from "@/db/schema";
import { eq } from "drizzle-orm";
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
  const announcementId = parseId(id);
  if (!announcementId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json();
  if (typeof body.active !== "boolean") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await db
    .update(announcements)
    .set({ active: body.active })
    .where(eq(announcements.id, announcementId))
    .returning();

  if (result.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(result[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db } = admin;
  const { id } = await params;
  const announcementId = parseId(id);
  if (!announcementId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  await db
    .delete(announcements)
    .where(eq(announcements.id, announcementId));

  return new Response(null, { status: 204 });
}

import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { getAdminUser } from "@/lib/admin-helpers";
import { announcements, announcementDismissals } from "@/db/schema";
import { eq, and, sql, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope");

  if (scope === "admin") {
    const admin = await getAdminUser();
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const all = await admin.db
      .select()
      .from(announcements)
      .orderBy(sql`${announcements.createdAt} DESC`);
    return Response.json(all);
  }

  // Regular user — active, undismissed announcements
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db, userId } = authResult;

  const result = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      body: announcements.body,
      createdAt: announcements.createdAt,
      active: announcements.active,
    })
    .from(announcements)
    .leftJoin(
      announcementDismissals,
      and(
        eq(announcementDismissals.announcementId, announcements.id),
        eq(announcementDismissals.userId, userId)
      )
    )
    .where(
      and(
        eq(announcements.active, true),
        isNull(announcementDismissals.id)
      )
    )
    .orderBy(sql`${announcements.createdAt} DESC`);

  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db } = admin;

  const body = await request.json();
  const { title, body: announcementBody } = body;

  if (!title?.trim() || !announcementBody?.trim()) {
    return Response.json(
      { error: "Title and body are required" },
      { status: 400 }
    );
  }

  const result = await db
    .insert(announcements)
    .values({
      title: title.trim(),
      body: announcementBody.trim(),
    })
    .returning();

  return Response.json(result[0], { status: 201 });
}

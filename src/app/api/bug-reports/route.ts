import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { getAdminUser } from "@/lib/admin-helpers";
import { bugReports, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const adminResult = await getAdminUser();
  if (!adminResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db } = adminResult;

  const reports = await db
    .select({
      id: bugReports.id,
      userId: bugReports.userId,
      title: bugReports.title,
      description: bugReports.description,
      status: bugReports.status,
      createdAt: bugReports.createdAt,
      resolvedAt: bugReports.resolvedAt,
      submitterName: users.name,
    })
    .from(bugReports)
    .leftJoin(users, eq(bugReports.userId, users.id))
    .orderBy(desc(bugReports.createdAt));

  return Response.json(reports);
}

export async function POST(request: NextRequest) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db, userId } = authResult;

  const body = await request.json();
  const { title, description } = body;

  if (!title?.trim() || !description?.trim()) {
    return Response.json({ error: "Title and description are required" }, { status: 400 });
  }

  const [report] = await db
    .insert(bugReports)
    .values({
      userId,
      title: title.trim(),
      description: description.trim(),
    })
    .returning();

  return Response.json(report, { status: 201 });
}

import { getAdminUser } from "@/lib/admin-helpers";
import { bugReports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { parseId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminResult = await getAdminUser();
  if (!adminResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db } = adminResult;
  const { id } = await params;
  const bugId = parseId(id);
  if (!bugId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  const body = await request.json();
  const { action } = body;

  if (action !== "fix") {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  await db
    .update(bugReports)
    .set({
      status: "fixed",
      resolvedAt: sql`(datetime('now'))`,
    })
    .where(eq(bugReports.id, bugId));

  return Response.json({ success: true });
}

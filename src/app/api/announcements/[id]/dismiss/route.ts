import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { announcementDismissals } from "@/db/schema";
import type { NextRequest } from "next/server";
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
  const { db, userId } = authResult;
  const { id } = await params;
  const announcementId = parseId(id);
  if (!announcementId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  // INSERT OR IGNORE to handle unique constraint
  await db
    .insert(announcementDismissals)
    .values({
      announcementId,
      userId,
    })
    .onConflictDoNothing();

  return Response.json({ dismissed: true });
}

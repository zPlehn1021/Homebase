import { eq, desc } from "drizzle-orm";
import { taskCompletions } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    const completions = await db
      .select()
      .from(taskCompletions)
      .where(eq(taskCompletions.userId, userId))
      .orderBy(desc(taskCompletions.completedAt));

    return Response.json(completions);
  } catch (error) {
    console.error("GET /api/tasks/completions error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

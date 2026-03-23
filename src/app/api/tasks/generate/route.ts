import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { generateTasksForUser } from "@/lib/generate-tasks";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;
    const body = await request.json().catch(() => ({}));

    // Get user profile for property type and features
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];

    const homeFeatures: string[] =
      body.homeFeatures ||
      (user?.homeFeatures ? (user.homeFeatures as string[]) : []);

    const count = await generateTasksForUser(
      db,
      userId,
      user?.propertyType || "house",
      homeFeatures
    );

    return Response.json({ generated: count });
  } catch (error) {
    console.error("POST /api/tasks/generate error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

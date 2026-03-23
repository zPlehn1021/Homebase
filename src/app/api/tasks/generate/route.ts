import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { generateTasksForUser } from "@/lib/generate-tasks";
import type { PreviewTask } from "@/lib/generate-tasks";

export const dynamic = "force-dynamic";

// Preview mode: returns tasks that WOULD be generated without inserting
export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;
    const { searchParams } = request.nextUrl;

    const propertyType = searchParams.get("propertyType") || "house";
    const featuresParam = searchParams.get("homeFeatures") || "";
    const homeFeatures = featuresParam ? featuresParam.split(",").filter(Boolean) : [];

    const preview = await generateTasksForUser(
      db,
      userId,
      propertyType,
      homeFeatures,
      { preview: true }
    );

    return Response.json(preview as PreviewTask[]);
  } catch (error) {
    console.error("GET /api/tasks/generate error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const excludedTitles: string[] = body.excludedTitles || [];

    const count = await generateTasksForUser(
      db,
      userId,
      user?.propertyType || "house",
      homeFeatures,
      { excludedTitles }
    );

    return Response.json({ generated: count as number });
  } catch (error) {
    console.error("POST /api/tasks/generate error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

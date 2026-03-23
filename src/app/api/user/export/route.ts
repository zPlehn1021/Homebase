import { eq } from "drizzle-orm";
import { users, tasks } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        propertyType: users.propertyType,
        homeAgeYears: users.homeAgeYears,
        squareFootage: users.squareFootage,
        homeFeatures: users.homeFeatures,
        onboardingCompleted: users.onboardingCompleted,
        purchaseVerified: users.purchaseVerified,
        emailReminders: users.emailReminders,
        reminderFrequency: users.reminderFrequency,
        weeklyDigest: users.weeklyDigest,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: userResult[0] || null,
      tasks: allTasks,
    };

    const dateStr = new Date().toISOString().split("T")[0];

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="homebase-export-${dateStr}.json"`,
      },
    });
  } catch (error) {
    console.error("GET /api/user/export error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

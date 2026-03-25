import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        propertyType: users.propertyType,
        homeAgeYears: users.homeAgeYears,
        squareFootage: users.squareFootage,
        homeFeatures: users.homeFeatures,
        onboardingCompleted: users.onboardingCompleted,
        emailReminders: users.emailReminders,
        reminderFrequency: users.reminderFrequency,
        weeklyDigest: users.weeklyDigest,
        purchaseVerified: users.purchaseVerified,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("GET /api/user error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;
    const body = await request.json();

    const updates: Record<string, unknown> = {};

    if (body.propertyType !== undefined) updates.propertyType = body.propertyType;
    if (body.homeAgeYears !== undefined) updates.homeAgeYears = body.homeAgeYears;
    if (body.squareFootage !== undefined) updates.squareFootage = body.squareFootage;
    if (body.homeFeatures !== undefined) updates.homeFeatures = JSON.stringify(body.homeFeatures);
    if (body.onboardingCompleted !== undefined) updates.onboardingCompleted = body.onboardingCompleted;
    if (body.name !== undefined) updates.name = body.name;
    if (body.emailReminders !== undefined) updates.emailReminders = body.emailReminders;
    if (body.reminderFrequency !== undefined) updates.reminderFrequency = JSON.stringify(body.reminderFrequency);
    if (body.weeklyDigest !== undefined) updates.weeklyDigest = body.weeklyDigest;

    if (Object.keys(updates).length === 0) {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      return Response.json(user[0]);
    }

    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return Response.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/user error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { users } from "@/db/schema";

export async function GET() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { db, userId } = authResult;

  const user = await db
    .select({
      hasDonated: users.hasDonated,
      lastDonationPromptAt: users.lastDonationPromptAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(user[0]);
}

export async function POST() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { db, userId } = authResult;

  await db
    .update(users)
    .set({ lastDonationPromptAt: new Date().toISOString() })
    .where(eq(users.id, userId));

  return Response.json({ success: true });
}

import { eq } from "drizzle-orm";
import { users, tasks, accounts, sessions } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db, userId } = authResult;

    // Delete in dependency order
    await db.delete(tasks).where(eq(tasks.userId, userId));
    await db.delete(sessions).where(eq(sessions.userId, userId));
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/user/delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

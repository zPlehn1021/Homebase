import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Database } from "@/db";
import type { Session } from "next-auth";

interface AdminResult {
  db: Database;
  userId: number;
  session: Session;
}

export async function getAdminUser(): Promise<AdminResult | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb();
  if (!db) return null;

  const userId = Number(session.user.id);

  const dbUser = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!dbUser[0]?.isAdmin) return null;

  return { db, userId, session };
}

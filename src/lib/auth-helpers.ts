import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import type { Database } from "@/db";
import type { Session } from "next-auth";

interface AuthResult {
  db: Database;
  userId: number;
  session: Session;
}

export async function getAuthenticatedUser(): Promise<AuthResult | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb();
  if (!db) return null;

  return {
    db,
    userId: Number(session.user.id),
    session,
  };
}

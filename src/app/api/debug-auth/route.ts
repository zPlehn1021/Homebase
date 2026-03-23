import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const checks: Record<string, unknown> = {};

  checks.AUTH_URL = process.env.AUTH_URL || "missing";
  checks.REQUEST_URL = request.url;
  checks.NODE_ENV = process.env.NODE_ENV || "not set";

  // Test DB query
  try {
    const { getDb } = await import("@/db");
    const db = getDb();
    if (db) {
      const { users } = await import("@/db/schema");
      const result = await db.select({ id: users.id }).from(users).limit(1);
      checks.DB_QUERY = "ok, " + result.length + " users";
    } else {
      checks.DB_QUERY = "getDb null";
    }
  } catch (e: unknown) {
    checks.DB_QUERY = e instanceof Error ? e.message : String(e);
  }

  // Test session insert (the likely failure point)
  try {
    const { getDb } = await import("@/db");
    const db = getDb();
    if (db) {
      const { sessions } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      const testToken = "test-" + Date.now();
      const expires = new Date(Date.now() + 86400000);
      await db.insert(sessions).values({
        sessionToken: testToken,
        userId: 1,
        expires: expires,
      });
      await db.delete(sessions).where(eq(sessions.sessionToken, testToken));
      checks.SESSION_INSERT = "ok";
    }
  } catch (e: unknown) {
    checks.SESSION_INSERT = e instanceof Error ? e.message + " | " + e.stack?.split("\n").slice(0, 3).join(" ") : String(e);
  }

  // Test auth() call
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    checks.AUTH_CALL = session ? "has session" : "no session (ok)";
  } catch (e: unknown) {
    checks.AUTH_CALL = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(checks, { status: 200 });
}

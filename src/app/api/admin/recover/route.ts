import { timingSafeEqual } from "crypto";
import { getDb } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_RECOVERY_SECRET;
  if (!secret) {
    return Response.json(
      { error: "Recovery not configured" },
      { status: 500 }
    );
  }

  // Accept secret from either Authorization header or JSON body
  let providedSecret: string | null = null;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    providedSecret = authHeader.replace("Bearer ", "");
  } else {
    try {
      const body = await request.json();
      providedSecret = body.secret ?? null;
    } catch {
      // No valid body
    }
  }

  if (
    !providedSecret ||
    providedSecret.length !== secret.length ||
    !timingSafeEqual(Buffer.from(providedSecret), Buffer.from(secret))
  ) {
    return Response.json({ error: "Authentication failed" }, { status: 403 });
  }

  const db = getDb();
  if (!db) {
    return Response.json({ error: "Database unavailable" }, { status: 500 });
  }

  // Find the admin user
  const adminUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.isAdmin, true))
    .limit(1);

  if (!adminUser[0]) {
    return Response.json({ error: "Authentication failed" }, { status: 403 });
  }

  // Create a new session token
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(sessions).values({
    sessionToken,
    userId: adminUser[0].id,
    expires,
  });

  // Set the session cookie
  const useSecure = process.env.AUTH_URL?.startsWith("https://") ?? false;
  const cookieName = useSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionToken, {
    httpOnly: true,
    secure: useSecure,
    sameSite: "lax",
    path: "/",
    expires,
  });

  return Response.json({ success: true, redirectTo: "/admin" });
}

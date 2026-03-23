import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars exist (don't expose values)
  checks.AUTH_SECRET = process.env.AUTH_SECRET ? "✅ set" : "❌ missing";
  checks.AUTH_URL = process.env.AUTH_URL ? `✅ ${process.env.AUTH_URL}` : "❌ missing";
  checks.AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID ? "✅ set" : "❌ missing";
  checks.AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET ? "✅ set" : "❌ missing";
  checks.AUTH_RESEND_KEY = process.env.AUTH_RESEND_KEY ? "✅ set" : "❌ missing";
  checks.TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ? "✅ set" : "❌ missing";
  checks.TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ? "✅ set" : "❌ missing";
  checks.NODE_ENV = process.env.NODE_ENV || "not set";

  // Test DB connection
  try {
    const { getDb } = await import("@/db");
    const db = getDb();
    if (db) {
      checks.DB_CONNECTION = "✅ connected";
    } else {
      checks.DB_CONNECTION = "❌ getDb() returned null";
    }
  } catch (e: unknown) {
    checks.DB_CONNECTION = `❌ ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test auth import
  try {
    await import("@/lib/auth");
    checks.AUTH_IMPORT = "✅ loaded";
  } catch (e: unknown) {
    checks.AUTH_IMPORT = `❌ ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks, { status: 200 });
}

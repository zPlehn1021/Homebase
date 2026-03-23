import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let _db: Database | null = null;

export function getDb(): Database | null {
  if (!process.env.TURSO_DATABASE_URL) return null;
  if (!_db) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

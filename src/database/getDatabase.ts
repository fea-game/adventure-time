import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/node";
import { err, ok, type Result } from "../utils/Result";

export type Database = ReturnType<typeof drizzle>;

let db: ReturnType<typeof drizzle> | null = null;

export function getDatabase(): Result<Database, Error> {
  if (!db) {
    try {
      if (
        !import.meta.env.TURSO_DATABASE_URL ||
        !import.meta.env.TURSO_AUTH_TOKEN
      ) {
        throw new Error("Database configuration missing!");
      }

      const turso = createClient({
        url: import.meta.env.TURSO_DATABASE_URL,
        authToken: import.meta.env.TURSO_AUTH_TOKEN,
      });

      db = drizzle(turso);
    } catch (cause) {
      return err(new Error("Connecting to the Database failed", { cause }));
    }
  }

  return ok(db);
}

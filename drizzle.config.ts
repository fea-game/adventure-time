import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env" });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN)
  throw new Error("Database is not configured!");

export default {
  schema: "./src/common/repository/schema.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;

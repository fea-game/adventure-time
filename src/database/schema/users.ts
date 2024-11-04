import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const users = sqliteTable("User", {
  id: text().primaryKey().default(uuidv4()),
  role: text({ enum: ["admin", "member"] }).notNull(),
  externalId: text().unique().notNull(),
  externalSystem: text({ enum: ["clerk"] }).notNull(),
});

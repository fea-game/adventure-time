import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("User", {
  id: text().primaryKey(),
  role: text({ enum: ["admin", "member"] }).notNull(),
});

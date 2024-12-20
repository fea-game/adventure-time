import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("User", {
  id: text().primaryKey(),
  role: text({ enum: ["admin", "member"] }).notNull(),
});

export type User = typeof users.$inferSelect;

export const UserSelectSchema = createSelectSchema(users);

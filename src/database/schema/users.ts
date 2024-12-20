import type { InferSelectModel } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("User", {
  id: text().primaryKey(),
  role: text({ enum: ["admin", "member"] }).notNull(),
});

export type User = InferSelectModel<typeof users>;

export const UserSelectSchema = createSelectSchema(users);

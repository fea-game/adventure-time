import { real, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

export const llms = sqliteTable("Llm", {
  id: text().primaryKey().default(uuidv4()),
  name: text().notNull(),
  description: text(),
  apiKey: text().notNull(),
  model: text(),
  temperature: real(),
  topP: real(),
  maxTokens: real(),
  frequencyPenalty: real(),
  presencePenalty: real(),
});

export type Llm = typeof llms.$inferSelect;

export const LlmSelectSchema = createSelectSchema(llms);

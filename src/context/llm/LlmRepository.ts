import {
  llms,
  LlmSelectSchema,
  type Llm as LlmRow,
} from "../../database/schema/llms";
import { err, ok, type Result } from "../../utils/Result";
import { SqliteRepository } from "../../database/SqliteRepository";
import { assertIsValid } from "../../utils/validation";
import type { User } from "../user/UserRepository";

export type Llm = {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string | undefined | null;
  readonly config: LlmConfig;
};

export type LlmConfig = {
  apiKey: string;
  provider: LlmRow["provider"];
  model?: string | undefined | null; // Default model to use
  temperature?: number | undefined | null; // Default temperature for creativity
  topP?: number | undefined | null; // Default nucleus sampling value
  maxTokens?: number | undefined | null; // Default maximum token count
  frequencyPenalty?: number | undefined | null; // Default penalty for frequent words
  presencePenalty?: number | undefined | null; // Default penalty to encourage new ideas
};

export class LlmRepository extends SqliteRepository<Llm> {
  constructor() {
    super(llms, LlmRepository.fromRow);
  }

  private static fromRow(row: any): Llm {
    assertIsValid<LlmRow>(row, LlmSelectSchema);

    const { id, userId, name, description, ...config } = row;

    const llm: Llm = {
      id,
      userId,
      name,
      description,
      config,
    };

    return llm;
  }

  override async all(userId: Llm["userId"]): Promise<Result<Llm[], Error>> {
    return super.all(userId);
  }

  async create(newLlm: Omit<Llm, "id">): Promise<Result<Llm, Error>> {
    try {
      const result = await this.database
        .insert(this.table)
        .values({
          userId: newLlm.userId,
          name: newLlm.name,
          description: newLlm.description ?? null,
          apiKey: newLlm.config.apiKey,
          provider: newLlm.config.provider,
          model: newLlm.config.model ?? null,
          temperature: newLlm.config.temperature ?? null,
          topP: newLlm.config.topP ?? null,
          maxTokens: newLlm.config.maxTokens ?? null,
          frequencyPenalty: newLlm.config.frequencyPenalty ?? null,
          presencePenalty: newLlm.config.presencePenalty ?? null,
        })
        .returning();

      if (Array.isArray(result) && result.length === 1 && result[0]) {
        return ok(this.fromRow(result[0]));
      }

      if (!Array.isArray(result) && result.rows.length === 1) {
        return ok(this.fromRow(result.rows[0]));
      }

      throw new Error("Creating a new record failed!");
    } catch (e) {
      return err(
        new Error((e as Error).message ?? "Creating a new record failed!", {
          cause: e,
        })
      );
    }
  }
}

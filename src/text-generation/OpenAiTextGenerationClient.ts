import OpenAI from "openai";
import { err, ok } from "../utils/Result";
import { toError } from "../utils/toError";
import type {
  TextGenerationClient,
  TextGenerationClientConfig,
  TextGenerationRequest,
  TextGenerationResponse,
} from "./types/TextGenerationClient";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { message } from "./prompts/setup.v1";
import type { NonUndefined } from "../utils/NonUndefined";
import { filterUndefined } from "../utils/filterUndefined";

export class OpenAiTextGenerationClient implements TextGenerationClient {
  private static DEFAULT_CONFIG = {
    model: "gpt-3.5-turbo", // Default model
    temperature: 0.7, // Creativity level
    topP: 0.9, // Nucleus sampling level
    maxTokens: 150, // Default token limit
    frequencyPenalty: 0, // Penalize repeated words
    presencePenalty: 0.6, // Encourage new topics
  } as const satisfies Omit<NonUndefined<TextGenerationClientConfig>, "apiKey">;

  private config: NonUndefined<TextGenerationClientConfig>;
  private openAi: OpenAI;
  private messages: Array<ChatCompletionMessageParam> = [message];

  constructor(config: TextGenerationClientConfig) {
    this.config = this.addDefaults(config);
    this.openAi = new OpenAI({ apiKey: this.config.apiKey, timeout: 5000 });
  }

  private addDefaults({
    apiKey,
    ...config
  }: TextGenerationClientConfig): NonUndefined<TextGenerationClientConfig> {
    return {
      ...OpenAiTextGenerationClient.DEFAULT_CONFIG,
      ...filterUndefined(config),
      apiKey,
    };
  }

  async generate(req: TextGenerationRequest): Promise<TextGenerationResponse> {
    try {
      this.messages.push({
        role: "user",
        content: req.prompt,
      });

      const result = await this.openAi.chat.completions.create({
        model: this.config.model,
        frequency_penalty: this.config.frequencyPenalty,
        max_completion_tokens: this.config.maxTokens,
        presence_penalty: this.config.presencePenalty,
        temperature: this.config.temperature,
        top_p: this.config.topP,
        messages: this.messages,
      });

      if (!result.choices[0]?.message.content) {
        console.error(
          `Error: "No response text available."`,
          JSON.stringify(result, null, 2)
        );
        throw new Error(`Error: "No response text available."`);
      }

      this.messages.push(result.choices[0].message);

      return ok({ message: result.choices[0].message.content });
    } catch (error) {
      return err(toError(error));
    }
  }
}

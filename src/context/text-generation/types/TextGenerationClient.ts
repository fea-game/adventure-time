import type { Result } from "../../utils/Result";

export interface TextGenerationClient {
  generate(req: TextGenerationRequest): Promise<TextGenerationResponse>;
}

export type TextGenerationRequest = {
  prompt: string;
};

export type TextGenerationResponse = Result<{ message: string }, Error>;

export interface TextGenerationClientConfig {
  apiKey: string;
  model?: string | undefined; // Default model to use
  temperature?: number | undefined; // Default temperature for creativity
  topP?: number | undefined; // Default nucleus sampling value
  maxTokens?: number | undefined; // Default maximum token count
  frequencyPenalty?: number | undefined; // Default penalty for frequent words
  presencePenalty?: number | undefined; // Default penalty to encourage new ideas
}

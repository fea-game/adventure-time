import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { TextGenerationClient } from "../types/TextGenerationClient";
import { OpenAiTextGenerationClient } from "../OpenAiTextGenerationClient";

let client: TextGenerationClient;

export const generateText = defineAction({
  input: z.object({
    player: z.string(),
    prompt: z.string(),
  }),
  handler: async (input) => {
    if (!client) {
      const apiKey = import.meta.env.OPEN_AI_API_KEY;
      const model = import.meta.env.OPEN_AI_API_MODEL;

      if (!apiKey) {
        throw new Error("Missing TextGenerationClient configuration!");
      }

      client = new OpenAiTextGenerationClient({
        apiKey,
        model,
      });
    }

    const result = await client.generate({
      prompt: `From ${input.player}: ${input.prompt}`,
    });

    if (result.isError) throw result.error;

    return result.data;
  },
});

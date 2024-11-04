import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import * as textGenerationActions from "../context/text-generation/actions";

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      return `Hello, ${input.name}!`;
    },
  }),
  ...textGenerationActions,
};

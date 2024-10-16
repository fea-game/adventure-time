// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  server: {
    host: process.env.HOST ?? "127.0.0.1",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
  adapter: node({
    mode: "standalone",
  }),
});

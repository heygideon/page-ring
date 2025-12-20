// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",

  vite: {
    plugins: [tailwindcss()],
    server: {
      cors: { preflightContinue: true },
    },
  },

  adapter: cloudflare(),

  integrations: [mdx()],

  markdown: {
    shikiConfig: {
      theme: "catppuccin-latte",
    },
  },
});

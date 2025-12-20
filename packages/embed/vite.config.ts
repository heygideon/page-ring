import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { analyzer } from "vite-bundle-analyzer";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/embed.ts"),
      name: "embed",
      // the proper extensions will be added
      fileName: "embed",
    },
  },

  plugins: [
    svelte(),
    tailwindcss(),
    analyzer({
      analyzerPort: 8887,
    }),
  ],
});

import { defineConfig } from "vite";
import { resolve } from "node:path";

/** Optional hover animation chunk — only fetched when data-animate is set. */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/animate-entry.ts"),
      formats: ["es"],
      fileName: () => "credit-animate.js",
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});

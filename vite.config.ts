import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [],
  publicDir: "assets",
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "HandbookBuiltBy",
      formats: ["iife"],
      fileName: () => "credit.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    copyPublicDir: false,
    outDir: "dist",
    emptyOutDir: true,
  },
});

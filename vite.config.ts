import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: "./src/index.ts",
        formats: ["es", "cjs"],
        fileName: (format) => `index.qwik.${format === "es" ? "mjs" : "cjs"}`,
      },
    },
    plugins: [qwikVite(), tsconfigPaths()],
    test: {
      globals: true,
      // environment: 'jsdom',
      // setupFiles: ['<PATH_TO_SETUP_FILE>'],
      coverage: {
        reporter: "text", // ["text", "json", "html"]
      },
    }
  };
});

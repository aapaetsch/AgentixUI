// Vitest configuration for aapaetsch-ui-kit
// Component and unit tests run in jsdom with the React plugin.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Never watch in CI: `npm test` runs `vitest run`.
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/components/**/index.tsx", "src/lib/**/*.ts"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  },
});
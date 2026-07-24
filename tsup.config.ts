import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/finance.ts",
    "src/templates/investment-ops/index.ts",
    "src/globals.css",
  ],
  format: ["cjs", "esm"], // Output both CommonJS (for Electron/Node) and ESM (for Bundlers)
  dts: {
    // Only generate .d.ts for TypeScript files (CSS has no types)
    entry: ["src/index.ts", "src/finance.ts", "src/templates/investment-ops/index.ts"],
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"], // Never bundle React itself
  // Ensure CSS is handled - this will output a css file alongside the js
  injectStyle: false,
});
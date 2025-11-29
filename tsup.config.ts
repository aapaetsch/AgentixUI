import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/globals.css"],
  format: ["cjs", "esm"], // Output both CommonJS (for Electron/Node) and ESM (for Bundlers)
  dts: {
    entry: ["src/index.ts"], // Only generate .d.ts for TypeScript files
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"], // Never bundle React itself
  // Ensure CSS is handled - this will output a css file alongside the js
  injectStyle: false, 
});
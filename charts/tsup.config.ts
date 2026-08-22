import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    quant: "src/quant.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  banner: { js: '"use client";' },
  external: [
    "aapaetsch-ui-kit",
    "react",
    "react-dom",
    "recharts",
  ],
});

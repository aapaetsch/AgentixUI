import { defineConfig, type Options } from "tsup";

const shared: Options = {
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
  external: ["aapaetsch-icons", "aapaetsch-ui-kit", "react", "react-dom"],
};

export default defineConfig([
  {
    ...shared,
    entry: {
      core: "src/core/index.ts",
      indicators: "src/indicators/index.ts",
      overlays: "src/overlays/index.ts",
    },
    clean: true,
  },
  {
    ...shared,
    splitting: true,
    entry: {
      index: "src/index.ts",
      drawings: "src/drawings/index.ts",
      controls: "src/controls/index.tsx",
      workspace: "src/workspace/index.tsx",
    },
    clean: false,
    treeshake: false,
    banner: { js: '\"use client\";' },
  },
]);

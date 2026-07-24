import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/react-server.ts",
    "src/finance.ts",
    "src/finance-server.ts",
    "src/templates/investment-ops/index.ts",
    "src/templates/investment-ops/react-server.tsx",
  ],
  format: ["cjs", "esm"], // Output both CommonJS (for Electron/Node) and ESM (for Bundlers)
  dts: {
    // Only generate .d.ts for TypeScript files (CSS has no types)
    entry: [
      "src/index.ts",
      "src/react-server.ts",
      "src/finance.ts",
      "src/finance-server.ts",
      "src/templates/investment-ops/index.ts",
      "src/templates/investment-ops/react-server.tsx",
    ],
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // lucide-react 0.474.0 advertises a CommonJS file inside a type=module
  // package. Bundle the selected icons so the documented native CommonJS
  // entrypoints remain executable; THIRD_PARTY_NOTICES preserves its ISC text.
  noExternal: ["lucide-react"],
  external: [
    // Never bundle peer deps.
    "react",
    "react-dom",
    // Keep runtime library deps external so consumers (especially Next.js /
    // Turbopack SSR) evaluate the original dependency modules instead of a
    // single giant bundled blob. This avoids SSR/runtime mismatches inside
    // Radix/HeadlessUI/CVA and preserves package-level tree shaking.
    "@headlessui/react",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-popover",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slider",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toast",
    "@radix-ui/react-toggle-group",
    "@radix-ui/react-toolbar",
    "@radix-ui/react-tooltip",
    "@tanstack/react-table",
    "@tanstack/react-virtual",
    "@use-gesture/react",
    "class-variance-authority",
    "clsx",
    "cmdk",
    "date-fns",
    "embla-carousel-autoplay",
    "embla-carousel-react",
    "react-day-picker",
    "react-resizable-panels",
    "tailwind-merge",
  ],
  // Ensure CSS is handled - this will output a css file alongside the js
  injectStyle: false,
});
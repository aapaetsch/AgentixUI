import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "node:path";

const config: StorybookConfig = {
  stories: [
    "../icons/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../charts/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../charts-market/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      resolve: {
        alias: [{ find: /^aapaetsch-ui-kit$/, replacement: path.resolve(__dirname, "../src/index.ts") }],
      },
      build: {
        sourcemap: false,
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
              return;
            }

            warn(warning);
          },
        },
      },
    }),
};

export default config;

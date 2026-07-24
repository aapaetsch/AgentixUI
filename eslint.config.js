// ESLint 9 flat config for aapaetsch-ui-kit
// Lints both the library source (src/) and the tooling files in the repo root.

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "storybook-static/**",
      "node_modules/**",
      "src/**/*.stories.tsx",
      "coverage/**",
      "fixtures/**/.next/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        // Bundler-injected patterns and Node type namespaces used by library
        // source. `process.env.NODE_ENV` is replaced at build time; `NodeJS`
        // is a type-only namespace (e.g. NodeJS.Timeout). Neither reaches the
        // browser runtime as a real global.
        process: "readonly",
        NodeJS: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      // TypeScript-aware rule baselines. No blanket disabling of recommended
      // rules; we only relax rules that conflict with TypeScript semantics.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    // Root-level tooling/config files (non-library): lighter rules.
    files: [
      "*.js",
      "*.cjs",
      "*.ts",
      "*.mjs",
      "scripts/**/*.mjs",
      "fixtures/**/*.mjs",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
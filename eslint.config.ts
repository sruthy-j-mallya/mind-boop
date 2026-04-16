import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tanstack from "@tanstack/eslint-plugin-query";

export default defineConfig([
  {
    ignores: ["node_modules", "src-tauri", ".cursor", ".vscode", ".public"],
  },
  {
    settings: {
      react: {
        version: "19.1.0",
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      unusedImports,
      prettier: prettierPlugin,
    },
    extends: [js.configs.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs.flat["recommended-latest"],
  tanstack.configs["flat/recommended"],
  prettierConfig,
  {
    files: ["**/*.{tsx,ts}"],
    rules: {
      "no-duplicate-imports": "error",
      "react/button-has-type": "error",
      "react/boolean-prop-naming": "warn",
      "arrow-body-style": ["error", "as-needed"],
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "react/react-in-jsx-scope": "off",
    },
  },
]);

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  { ignores: [".wrangler", "eslint.config.js", "dist/**/*"] },
  js.configs.recommended,
  prettierPlugin,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules,
      ...reactPlugin.configs.recommended.rules,
      "import/order": [
        "error",
        {
          groups: ["builtin", "external"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },
];

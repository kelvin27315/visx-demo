import js from "@eslint/js";
import prettierPlugin from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  js.configs.recommended,
  prettierPlugin,
  {
    files: ["app/**/*.{ts,tsx}"],
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
          pathGroups: [
            {
              pattern: "@/**",
              pathGroups: "internal",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },
];

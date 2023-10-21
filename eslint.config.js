import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      react: reactPlugin,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...ts.configs["recommended-type-checked"].rules,
      ...importPlugin.configs["recommended"].rules,
      "react/jsx-uses-react": "error",
      "react/jsx-users-vars": "error",
    },
  },
];

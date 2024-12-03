// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        on: "readonly",
        sendChat: "readonly",
        getObj: "readonly",
        findObjs: "readonly",
        log: "readonly",
        state: "readonly",
      },
    },
    rules: {
      indent: ["error", "tab"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-unused-vars": ["warn"],
      "arrow-body-style": ["warn", "always"],
      "prefer-const": ["warn"],
      "no-var": "error",
      "no-console": "warn",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ObjectPattern",
          message: "Destructuring is discouraged. Use explicit property access instead.",
        },
      ],
    },
  },
];

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
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" },
        { "blankLine": "always", "prev": "*", "next": "block-like" },
        { "blankLine": "always", "prev": "block-like", "next": "*" },
        { "blankLine": "always", "prev": "*", "next": "block" }, // Use "block" for block comments
        { "blankLine": "always", "prev": "directive", "next": "*" },
        { "blankLine": "always", "prev": "*", "next": "directive" }
      ],
      "lines-around-comment": [
        "error",
        {
          "beforeBlockComment": true,
          "beforeLineComment": true,
          "allowBlockStart": true,
          "allowObjectStart": true,
          "allowArrayStart": true
        }
      ],
      "prefer-destructuring": [
        "warn",
        {
          "VariableDeclarator": {
            "array": true,
            "object": true
          },
          "AssignmentExpression": {
            "array": true,
            "object": true
          }
        }
      ]
    }
  }
];

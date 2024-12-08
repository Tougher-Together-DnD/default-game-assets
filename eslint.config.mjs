// eslint.config.mjs
import js from "@eslint/js";
import preferArrow from "eslint-plugin-prefer-arrow";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
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
    plugins: {
      "prefer-arrow": preferArrow, // Register the plugin
    },
    rules: {
      // Enforce double quotes for strings
      quotes: ["error", "double"],

      // Enforce semicolons at the end of statements
      semi: ["error", "always"],

      // Enforce tab-based indentation
      indent: ["error", "tab"],

      // Enforce blank lines before comments
      "lines-around-comment": [
        "error",
        {
          beforeBlockComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],

      // Enforce destructuring for function parameters, avoid elsewhere
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { array: false, object: false },
          AssignmentExpression: { array: false, object: false },
        },
      ],

      // Enforce arrow functions in nested contexts using the plugin
      "prefer-arrow/prefer-arrow-functions": [
        "off",
        {
          disallowPrototype: false,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],

      // Restrict the use of function expressions in objects or nested functions
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionExpression",
          message: "Use arrow functions instead of function expressions in objects or inside named functions.",
        },
      ],

      // Disallow `var` and prefer `const` where applicable
      "no-var": "error",
      "prefer-const": ["warn"],

      // Enforce consistent spacing and blank lines
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" }
      ],

      // Other useful rules
      "no-unused-vars": ["warn"], // Warn on unused variables
      "arrow-body-style": ["warn", "always"], // Enforce arrow body style consistency
    },
  },
];

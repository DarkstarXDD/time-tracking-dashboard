import eslintJS from "@eslint/js"
import globals from "globals"

export default [
  {
    files: ["**/*.js"],
    ignores: ["dist"],

    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    rules: {
      ...eslintJS.configs.recommended.rules,
      "no-use-before-define": "error",
      "no-duplicate-imports": "error",
      camelcase: "error",
    },
  },
]

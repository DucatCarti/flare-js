import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginTypeScript from "typescript-eslint";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules", "dist"],
    plugins: {
      eslintPluginPrettier,
      eslintConfigPrettier,
      eslintPluginTypeScript,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
      },
    },
  },
  js.configs.recommended,
];

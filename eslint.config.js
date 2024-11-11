import globals from "globals";
import pluginJs from "@eslint/js";
import mochaPlugin from "eslint-plugin-mocha";
import html from "eslint-plugin-html";

import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  mochaPlugin.configs.flat.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.html"],
    plugins: { html },
  },
];

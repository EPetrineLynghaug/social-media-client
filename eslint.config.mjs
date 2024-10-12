import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import pluginCypress from "eslint-plugin-cypress";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser, // Add browser globals like `document`, `fetch`, etc.
      },
    },
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js"], // Applies only to Jest test files
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.jest, // Add Jest globals like `describe`, `it`, etc.
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
  {
    files: ["cypress.config.js", "cypress/**/*.cy.js"], // Applies to Cypress test files
    plugins: {
      cypress: pluginCypress,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.cypress, // Add Cypress globals like `cy`, `Cypress`, etc.
      },
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
      "no-undef": "off", // Disable `no-undef` for CommonJS globals like `require` and `module`
      "no-unused-vars": "off", // Disable `no-unused-vars` for config functions
    },
  },
];

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import pluginCypress from "eslint-plugin-cypress";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser, // JavaScript files
        global: "readonly", // Add global as a readonly global variable
      },
    },
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js"], // Jest test files
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.jest, // Jest-specific globals
        global: "readonly", // global is defined for Jest as well
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
  {
    files: ["cypress.config.js", "cypress/**/*.cy.js"], // For Cypress test 
    plugins: {
      cypress: pluginCypress,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, //Node globals 
        ...globals.cypress, // Cypress-specific globals
        global: "readonly", //  global for Cypress environment
      },
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
      "no-undef": "off", // Disable `no-undef` for CommonJS globals
      "no-unused-vars": "off", // Disable `no-unused-vars` for config functions
    },
  },
];

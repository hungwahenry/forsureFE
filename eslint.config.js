// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      // Web-React rule, irrelevant for React Native — RN renders text natively, no HTML escaping.
      "react/no-unescaped-entities": "off",
    },
  },
]);

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // Regla anti-hex: prohibir colores hardcodeados fuera de tokens.ts
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message:
          "No hardcodees colores hex. Usá los tokens de packages/ui/src/tokens.ts",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
  },
};

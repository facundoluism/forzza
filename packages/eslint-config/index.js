/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // Reglas anti-hardcode: colores y motion solo pueden vivir en tokens.ts
    // (y, para CSS, en globals.css — que ESLint no lintea). tokens.ts desactiva
    // esta regla vía override en su .eslintrc.
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message:
          "No hardcodees colores hex. Usá los tokens de packages/ui/src/tokens.ts",
      },
      {
        // Curvas de animación hardcodeadas en strings (CSS-in-JS, props de Easing, etc.)
        selector: "Literal[value=/cubic-bezier/]",
        message:
          "No hardcodees curvas de motion. Usá easing/cssEasing de packages/ui/src/tokens.ts.",
      },
      {
        selector: "TemplateElement[value.raw=/cubic-bezier/]",
        message:
          "No hardcodees curvas de motion. Usá easing/cssEasing de packages/ui/src/tokens.ts.",
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

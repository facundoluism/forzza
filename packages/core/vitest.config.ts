import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      exclude: [
        // Barrels / entrypoints sin lógica propia
        "src/index.ts",
        "src/schemas/index.ts",
        "src/supabase/**",
        "vitest.config.ts",
        // Los archivos de test no son código de producción —
        // v8 los incluye por defecto y baja el % de funciones
        // (los callbacks de it/describe cuentan como funciones no cubiertas)
        "src/**/__tests__/**",
        "src/**/*.test.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});

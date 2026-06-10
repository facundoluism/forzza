import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      exclude: [
        "src/index.ts", // re-exports only
        "src/schemas/index.ts", // schemas tested indirectly
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

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/src/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["**/node_modules/**", "dist", ".next", "tests/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/fixtures/"],
    },
  },
  resolve: {
    alias: {
      "@gym/shared-kernel": path.resolve(__dirname, "packages/shared-kernel/src"),
      "@gym/ui": path.resolve(__dirname, "packages/ui/src"),
      "@gym/api": path.resolve(__dirname, "packages/api/src"),
      "@gym/db": path.resolve(__dirname, "packages/db/src"),
    },
  },
});

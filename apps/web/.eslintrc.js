/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@gym/eslint-config/next"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["tailwind.config.ts"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};

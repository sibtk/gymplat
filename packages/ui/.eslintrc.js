/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@gym/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};

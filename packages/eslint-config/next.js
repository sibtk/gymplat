/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./index.js", "next/core-web-vitals"],
  rules: {
    // Allow default exports for Next.js pages, layouts, and route handlers
    "import/no-default-export": "off",
  },
};

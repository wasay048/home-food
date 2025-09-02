module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "object-curly-spacing": ["error", "never"],
    "operator-linebreak": ["error", "after"],
  },
};

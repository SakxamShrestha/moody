module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    indent: ["error", 2],
    "max-len": ["error", { "code": 120 }],
    "no-trailing-spaces": "error",
    "comma-dangle": ["error", "always-multiline"],
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};

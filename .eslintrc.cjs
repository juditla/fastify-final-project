/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
  extends: ['upleveled'],

  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
  },
};

module.exports = config;

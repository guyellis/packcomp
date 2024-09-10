module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'jest',
  ],
  rules: {
    'jest/no-disabled-tests': [2],
    'jest/no-focused-tests': [2],
    'jest/no-identical-title': [2],
    'jest/prefer-to-have-length': [2],
    'jest/valid-expect': [2],
  },
};

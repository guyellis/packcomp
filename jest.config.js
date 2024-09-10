module.exports = {
  verbose: false,
  collectCoverageFrom: [
    '!bin/**',
    '!coverage/**',
    '!jest.config.js',
    '!node_modules/**',
    '!test/**',
    'lib/**',
  ],
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  // setupTestFrameworkScriptFile: './test/setup.js',
  testMatch: ['**/test/**/*.test.js'],
  transformIgnorePatterns: [
    '<rootDir>/test/fixtures/3/package.json',
  ],
};

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
      branches: 2,
      functions: 2,
      lines: 2,
      statements: 2,
    },
  },
  // setupTestFrameworkScriptFile: './test/setup.js',
  testMatch: ['**/test/**/*.test.js'],
};

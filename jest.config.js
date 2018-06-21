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
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  // setupTestFrameworkScriptFile: './test/setup.js',
  testMatch: ['**/test/**/*.test.js'],
};

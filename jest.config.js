module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'backend/**/*.js',
    'auth/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  setupFiles: ['./tests/setup.js'],
  testTimeout: 10000
};

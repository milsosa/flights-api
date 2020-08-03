// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  bail: true,
  moduleFileExtensions: ['js', 'ts'],
  roots: ['src'],
  testMatch: ['<rootDir>/src/tests/**/?(*.)test.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
};

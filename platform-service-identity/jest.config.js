module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!main.ts',
    '!**/*.module.ts',
    '!**/*.config.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/proto/**',
    '!**/domain/events/**',
    '!**/domain/enums/**',
    '!**/application/dtos/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/config/(.*)$': '<rootDir>/config/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    '^@/modules/(.*)$': '<rootDir>/modules/$1',
  },
};
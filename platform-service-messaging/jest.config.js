module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  // This helps Jest resolve module aliases defined in tsconfig.json
  moduleNameMapper: {
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    '^@/modules/(.*)$': '<rootDir>/modules/$1',
  },
};
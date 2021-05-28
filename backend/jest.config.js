module.exports = {
  roots: ['.'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['tests/utils'],
  testPathIgnorePatterns: ['/node_modules', '/coverage', '/build'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts']
};

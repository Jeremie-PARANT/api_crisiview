export default {
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  testPathIgnorePatterns: [
    '/node_modules/',
    '.*\.integration\.test\.js$'
  ],
};
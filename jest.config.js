module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
    '^.+\\.(js|cjs|mjs)?$': ['babel-jest'],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(cheerio)/)',
  ],
};

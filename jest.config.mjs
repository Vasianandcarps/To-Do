export default {
  injectGlobals: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  // This is vital to stop it from looking at compiled files
  modulePathIgnorePatterns: ["<rootDir>/dist/"], 
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
};
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/__tests__/__mocks__/jestSetup.js'],
  moduleNameMapper: {
    '^@jujistu/ui$': '<rootDir>/src/ui/index.ts',
    '^@jujistu/app/(.*)$': '<rootDir>/src/app/$1',
    '^@jujistu/features/(.*)$': '<rootDir>/src/features/$1',
    '^@jujistu/shared/(.*)$': '<rootDir>/src/shared/$1',
    '\\.css$': '<rootDir>/__tests__/__mocks__/styleMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@tanstack|react-native-reanimated|react-native-worklets)/)',
  ],
};

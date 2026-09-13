module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@jujistu/app/(.*)$': '<rootDir>/src/app/$1',
    '^@jujistu/features/(.*)$': '<rootDir>/src/features/$1',
    '^@jujistu/shared/(.*)$': '<rootDir>/src/shared/$1',
  },
};

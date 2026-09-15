/* eslint-env jest */
jest.mock('react-native-reanimated', () => {
  const reanimatedMock = require('react-native-reanimated/mock');
  reanimatedMock.default.call = () => {};
  return reanimatedMock;
});

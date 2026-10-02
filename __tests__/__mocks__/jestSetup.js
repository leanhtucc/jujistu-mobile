/* eslint-env jest */
jest.mock('react-native-reanimated', () => {
  const reanimatedMock = require('react-native-reanimated/mock');
  reanimatedMock.default.call = () => {};
  return reanimatedMock;
});

jest.mock('react-native-video', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockVideo = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      dismissFullscreenPlayer: jest.fn(),
      pause: jest.fn(),
      presentFullscreenPlayer: jest.fn(),
      resume: jest.fn(),
      seek: jest.fn(),
      setFullScreen: jest.fn(),
      setSource: jest.fn(),
      setVolume: jest.fn(),
    }));

    return React.createElement(View, { ...props, testID: 'native-video' });
  });

  return {
    __esModule: true,
    default: MockVideo,
    Video: MockVideo,
  };
});

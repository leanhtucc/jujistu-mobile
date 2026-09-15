const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@jujistu/ui': path.resolve(__dirname, 'src/ui'),
      '@jujistu/app': path.resolve(__dirname, 'src/app'),
      '@jujistu/features': path.resolve(__dirname, 'src/features'),
      '@jujistu/shared': path.resolve(__dirname, 'src/shared'),
    },
  },
};

module.exports = withNativeWind(mergeConfig(defaultConfig, config), {
  input: './global.css',
});

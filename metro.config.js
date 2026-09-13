const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('node:path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@jujistu/app': path.resolve(__dirname, 'src/app'),
      '@jujistu/features': path.resolve(__dirname, 'src/features'),
      '@jujistu/shared': path.resolve(__dirname, 'src/shared'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

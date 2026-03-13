/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const rootDir = path.resolve(__dirname, '../../');

module.exports = {
  projectRoot: rootDir,
  watchFolders: [rootDir],
  resolver: {
    nodeModulesPaths: [
      path.resolve(rootDir, 'node_modules'),
    ],
    extraNodeModules: {
      'react-navigation-tabs': path.resolve(rootDir, 'node_modules/react-navigation-tabs'),
    },
  },
  transformer: {
    minifierPath: require.resolve('metro-minify-terser'),
    minifierConfig: {
      ecma: 2020,
      compress: { toplevel: true },
      mangle: { toplevel: true },
    },
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

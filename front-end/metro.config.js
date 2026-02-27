const path = require('path');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [__dirname],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    extraNodeModules: {
      'react-navigation-tabs': path.resolve(__dirname, 'node_modules/react-navigation-tabs'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

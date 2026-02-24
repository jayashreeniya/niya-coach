module.exports = {
  dependencies: {
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../blocks/core/node_modules/react-native-video/android-exoplayer',
        },
      },
    },
    'react-native-push-notification': {
      platforms: { android: null },
    },
    'react-native-tts': {
      platforms: { android: null },
    },
    'react-native-geolocation-service': {
      platforms: { android: null },
    },
    '@videosdk.live/react-native-foreground-service': {
      platforms: { android: null },
    },
    '@videosdk.live/react-native-incallmanager': {
      platforms: { android: null },
    },
    '@videosdk.live/react-native-webrtc': {
      platforms: { android: null },
    },
    'react-native-webview': {
      platforms: { android: null },
    },
    'react-native-gesture-handler': {
      platforms: { android: null },
    },
    'react-native-svg': {
      platforms: { android: null },
    },
    'react-native-device-info': {
      platforms: { android: null },
    },
    '@react-native-community/netinfo': {
      platforms: { android: null },
    },
    '@react-native-async-storage/async-storage': {
      platforms: { android: null },
    },
  },
};
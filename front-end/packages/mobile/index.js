// index.js - MOBILE
import React from 'react';
import {AppRegistry, LogBox, Alert, View, Text} from 'react-native';
import {name as appName} from './app.json';

const defaultHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected Error',
      `${error.name}: ${error.message}\n\nPlease restart the app.`,
      [{text: 'OK'}]
    );
  }
  if (defaultHandler) {
    defaultHandler(error, isFatal);
  }
});

let AppComponent;
try {
  const AppModule = require('./App');
  AppComponent = AppModule.App || AppModule.default;
} catch (e) {
  AppComponent = () => (
    React.createElement(View, {style: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e', padding: 20}},
      React.createElement(Text, {style: {color: '#ff6b6b', fontSize: 20, marginBottom: 16}}, 'JS Load Error'),
      React.createElement(Text, {style: {color: '#e0e0e0', fontSize: 14}}, e.name + ': ' + e.message),
      React.createElement(Text, {style: {color: '#888', fontSize: 12, marginTop: 16}}, String(e.stack || '').substring(0, 500))
    )
  );
}

const snapshots = false;
if (snapshots) {
  require('./indexSnapshot');
} else {
  AppRegistry.registerComponent(appName, () => AppComponent);
}

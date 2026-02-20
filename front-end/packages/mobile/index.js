// index.js - MOBILE
import {AppRegistry, LogBox, Alert} from 'react-native';
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

import {App} from './App';

const snapshots = false;
if(snapshots){
  require('./indexSnapshot');
}
else {
  AppRegistry.registerComponent(appName, () => App);
}

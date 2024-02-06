/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {handleBackgroundNotification} from './src/hooks/usePushNotification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  const notification = {
    data: remoteMessage.data,
    notification: remoteMessage.notification,
  };
  await handleBackgroundNotification(notification);
});

AppRegistry.registerComponent(appName, () => App);

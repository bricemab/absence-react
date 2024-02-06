import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {handleForegroundNotification} from '../hooks/usePushNotification';
PushNotification.createChannel(
  {
    channelId: 'channel-id', // (required)
    channelName: 'My channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);
const NotificationService = props => {
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the App!', remoteMessage);
      const notification = {
        data: remoteMessage.data,
        notification: remoteMessage.notification,
      };
      await handleForegroundNotification(notification);
    });
  }, []);
  return null;
};

export default NotificationService;

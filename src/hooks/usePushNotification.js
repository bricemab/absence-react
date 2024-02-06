import messaging from '@react-native-firebase/messaging';
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {NotificationCodes, UtilsTypes} from '../utils/types';
import Utils from '../utils/utils';
import dayjs from 'dayjs';

const usePushNotification = () => {
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    if (Platform.OS === 'ios') {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  };

  const hasPermission = async () => {
    return messaging().hasPermission();
  };

  return {
    requestPermission,
    hasPermission,
  };
};

export const addNotificationPending = async (notification, type) => {
  let notifications = await Utils.getDataFromKey(type);
  if (!notifications) {
    notifications = '{}';
  }
  notifications = JSON.parse(notifications);
  const timestamp = dayjs().valueOf();
  notifications[timestamp] = notification;
  await saveLastNotification(notifications, type);
};

export const saveLastNotification = async (
  notification,
  type = UtilsTypes.LAST_BG_NOTIFICATION,
) => {
  if (!notification) {
    notification = {};
  }
  await Utils.setData(type, JSON.stringify(notification));
};

export const handleBackgroundNotification = async notification => {
  console.log('handleBackgroundNotification => ');
  console.log(notification);
  switch (notification.data.code) {
    case NotificationCodes.REMOVE_DEVICE:
      await addNotificationPending(
        notification,
        UtilsTypes.LAST_BG_NOTIFICATION,
      );
      console.log('DECO LE GARS ICI');
      break;
    default:
      break;
  }
};

export const handleForegroundNotification = async notification => {
  console.log('handleForegroundNotification => ');
  console.log(notification);
  switch (notification.data.code) {
    case NotificationCodes.REMOVE_DEVICE:
      await Utils.clearAll();
      NativeModules.DevSettings.reload();
      console.log('DECO LE GARS ICI');
      break;
    default:
      break;
  }
};

export const manageNotificationsPending = async type => {
  const notifications = JSON.parse(await Utils.getDataFromKey(type));
  console.log('manageNotificationsPending');
  console.log(notifications);
  const newNotifications = {};
  for (const [key, notification] of Object.entries(notifications)) {
    switch (notification.data.code) {
      case NotificationCodes.REMOVE_DEVICE:
        await Utils.clearAll();
        NativeModules.DevSettings.reload();
        break;
      default:
        console.log(
          `Code: ${notification.data.code} not managed in manageNotificationsPending`,
        );
        newNotifications[key] = notification;
        break;
    }
  }
  await Utils.setData(type, JSON.stringify(newNotifications));
};

export default usePushNotification;

// import messaging from '@react-native-firebase/messaging';
// import {PermissionsAndroid, Platform} from 'react-native';
//
// const usePushNotification = () => {
//   const requestUserPermission = async () => {
//     if (Platform.OS === 'ios') {
//       //Request iOS permission
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//
//       if (enabled) {
//         console.log('Authorization status:', authStatus);
//       }
//     } else if (Platform.OS === 'android') {
//       //Request Android permission (For API level 33+, for 32 or below is not required)
//       const res = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//       );
//     }
//   };
//
//   const getFCMToken = async () => {
//     return messaging().getAPNSToken();
//     // const fcmToken = await messaging().getToken();
//     // if (fcmToken) {
//     //   console.log('Your Firebase Token is:', fcmToken);
//     //   return fcmToken;
//     // } else {
//     //   console.log('Failed', 'No token received');
//     //   return false;
//     // }
//   };
//
//   const listenToForegroundNotifications = async () => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log(
//         'A new message arrived! (FOREGROUND)',
//         JSON.stringify(remoteMessage),
//       );
//     });
//     return unsubscribe;
//   };
//
//   const listenToBackgroundNotifications = async () => {
//     const unsubscribe = messaging().setBackgroundMessageHandler(
//       async remoteMessage => {
//         console.log(
//           'A new message arrived! (BACKGROUND)',
//           JSON.stringify(remoteMessage),
//         );
//       },
//     );
//     return unsubscribe;
//   };
//
//   const onNotificationOpenedAppFromBackground = async () => {
//     const unsubscribe = messaging().onNotificationOpenedApp(
//       async remoteMessage => {
//         console.log(
//           'App opened from BACKGROUND by tapping notification:',
//           JSON.stringify(remoteMessage),
//         );
//       },
//     );
//     return unsubscribe;
//   };
//
//   const onNotificationOpenedAppFromQuit = async () => {
//     const message = await messaging().getInitialNotification();
//
//     if (message) {
//       console.log(
//         'App opened from QUIT by tapping notification:',
//         JSON.stringify(message),
//       );
//     }
//   };
//
//   return {
//     requestUserPermission,
//     getFCMToken,
//     listenToForegroundNotifications,
//     listenToBackgroundNotifications,
//     onNotificationOpenedAppFromBackground,
//     onNotificationOpenedAppFromQuit,
//   };
// };
//
// export default usePushNotification;
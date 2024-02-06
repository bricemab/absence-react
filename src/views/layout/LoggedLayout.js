import {NativeModules, View, AppState} from 'react-native';
import {useEffect, useState} from 'react';
import usePushNotification, {
  manageNotificationsPending,
} from '../../hooks/usePushNotification';
import messaging from '@react-native-firebase/messaging';
import NotificationService from '../../services/NotificationsService.android';
import Utils from '../../utils/utils';
import {UtilsTypes} from '../../utils/types';
const LoggedLayout = ({children}) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [notificationsData, setNotificationsData] = useState(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkForNotificationData();
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState]);

  const checkForNotificationData = async () => {
    const data = await Utils.getDataFromKey(UtilsTypes.LAST_BG_NOTIFICATION);
    if (data) {
      await manageNotificationsPending(UtilsTypes.LAST_BG_NOTIFICATION);
      setNotificationsData(JSON.parse(data));
    }
  };

  useEffect(() => {
    const messagingFcm = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log(await messaging().getToken());
      console.log('enabled' + enabled);
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
      await checkForNotificationData();
    };
    messagingFcm().then();
  }, []);

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <NotificationService />
      {children}
    </View>
  );
};

export default LoggedLayout;

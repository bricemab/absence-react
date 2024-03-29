import {
  ActivityIndicator,
  Image,
  NativeModules,
  Text,
  View,
} from 'react-native';
import BaseLayout from '../../layout/BaseLayout';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Utils from '../../../utils/utils';
import DeviceInfo from 'react-native-device-info';
import {jwtDecode} from 'jwt-decode';
import BadFaceImage from '../../../assets/bad-face.png';
import {UserErrors} from '../../../utils/CodeErrors';
import 'core-js/stable/atob';
import {UtilsTypes} from '../../../utils/types';
import messaging from '@react-native-firebase/messaging';
import usePushNotification from '../../../hooks/usePushNotification';
import Global from '../../../utils/Global';

const StateType = {
  REQUEST_PENDING: 'REQUEST_PENDING',
  REQUEST_ERROR: 'REQUEST_ERROR',
  REQUEST_SUCCESS: 'REQUEST_SUCCESS',
};

const RegisterKeyPage = ({route, navigation}) => {
  const {checkNotificationPermission} = usePushNotification();
  const [key, setKey] = useState('');
  const [state, setState] = useState(StateType.REQUEST_PENDING);
  const [params, setParams] = useState({});
  const [message, setMessage] = useState('');
  useEffect(() => {
    const toDo = async () => {
      setMessage('Récupération des données en cours...');
      setKey(route.params.key);
      setParams({
        key: route.params.key,
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        version: DeviceInfo.getSystemVersion(),
        os: DeviceInfo.getSystemName(),
        apnsToken: await messaging().getToken(),
      });
    };
    toDo().then();
  }, [route.params.key]);
  useEffect(() => {
    const toDo = async () => {
      await Utils.awaitTimeout(1500);
      setMessage('Configuration de votre compte en cours...');
      if (key && params.key) {
        const response = await Utils.postEncodedToBackend(
          '/users/register',
          params,
        );
        if (!response.success) {
          switch (response.error.code) {
            case UserErrors.KEY_NO_MATCH:
              setMessage(
                'Le token semble incorrecte. Veillez à bien cliquer sur le lien reçu par mail',
              );
              break;
            default:
              setMessage(
                "Le serveur ne répond pas. Veuillez contacter l'administrateur et lui transmettre le code suivant: " +
                  response.error.code,
              );
              break;
          }
          return setState(StateType.REQUEST_ERROR);
        }
        const {data} = response;
        const {token, userSession} = data;

        if (data && token) {
          const tokenDecoded = Utils.jwtDecode(token) || {};
          console.log('==============');
          console.log(tokenDecoded);

          if (tokenDecoded.currentUser) {
            Global.instanceAxios.defaults.headers.common['x-user-token'] =
              tokenDecoded.currentUser.userKey;
            Global.instanceAxios.defaults.headers.common['x-device-token'] =
              tokenDecoded.currentUser.deviceKey;
            Global.instanceAxios.defaults.headers.get['x-user-token'] =
              tokenDecoded.currentUser.userKey;
            Global.instanceAxios.defaults.headers.get['x-device-token'] =
              tokenDecoded.currentUser.deviceKey;
            await Utils.setData(UtilsTypes.TOKEN, token);
            await Utils.setData(UtilsTypes.DATA, tokenDecoded.currentUser);
            NativeModules.DevSettings.reload();
          }
        }
      }
    };
    toDo().then();
  }, [key, params]);

  return (
    <BaseLayout>
      <View style={styles.view}>
        {state === StateType.REQUEST_PENDING ? (
          <View>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.message}>{message}</Text>
          </View>
        ) : (
          <></>
        )}
        {state === StateType.REQUEST_ERROR ? (
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Image
              source={BadFaceImage}
              style={{
                width: 50,
                height: 50,
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.message}>{message}</Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default RegisterKeyPage;

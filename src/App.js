import {StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomePage from './views/pages/logged/HomePage';
import RegisterPage from './views/pages/no-logged/RegisterPage';
import RegisterKeyPage from './views/pages/no-logged/RegisterKeyPage';
import AddDevicePage from './views/pages/logged/AddDevicePage';
import {useEffect, useState} from 'react';
import Utils from './utils/utils';
import {jwtDecode} from 'jwt-decode';
import {Roles, UtilsTypes} from './utils/types';
import BaseLayout from './views/layout/BaseLayout';
import usePushNotification from './hooks/usePushNotification';
import {LoadingProvider} from './contexts/LoadingScreenContext';

const Stack = createNativeStackNavigator();

function renderLoggedInScreens(role) {
  return (
    <>
      <Stack.Screen
        name="home"
        component={HomePage}
        options={{headerShown: false}}
      />
      {role === Roles.USER_ADMIN && (
        <Stack.Screen
          name="add-device"
          component={AddDevicePage}
          options={{headerShown: false}}
        />
      )}
    </>
  );
}

function renderLoggedOutScreens() {
  return (
    <>
      <Stack.Screen
        name="register"
        component={RegisterPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="register-key"
        component={RegisterKeyPage}
        options={{headerShown: false}}
      />
    </>
  );
}

export default function App() {
  const {requestNotificationPermission} = usePushNotification();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(Roles.USER_ANONYMOUS);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await requestNotificationPermission();
        const storedToken = await Utils.getDataFromKey(UtilsTypes.TOKEN);
        setToken(storedToken);
        if (!storedToken) {
          throw new Error('No token found');
        }
        const tokenDecoded = jwtDecode(storedToken);
        if (!tokenDecoded.currentUser) {
          throw new Error('Invalid token');
        }
        setIsLoggedIn(true);
        setRole(tokenDecoded.currentUser.role);
        setLoadingAuth(false);
      } catch (e) {
        setIsLoggedIn(false);
        setRole(Roles.USER_ANONYMOUS);
        setLoadingAuth(false);
      }
    };

    initializeAuth();
  }, [requestNotificationPermission]);
  return loadingAuth ? (
    <LoadingProvider>
      <BaseLayout>
        <View />
      </BaseLayout>
    </LoadingProvider>
  ) : (
    <LoadingProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? renderLoggedInScreens(role) : renderLoggedOutScreens()}
        </Stack.Navigator>
      </NavigationContainer>
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

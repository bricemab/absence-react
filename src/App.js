import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomePage from './views/pages/logged/HomePage';
import RegisterPage from './views/pages/no-logged/RegisterPage';
import RegisterKeyPage from './views/pages/no-logged/RegisterKeyPage';
import AddDevicePage from './views/pages/logged/AddDevicePage';
import {createContext, useEffect, useState} from 'react';
import store from './store';
import Utils from './utils/utils';
import {jwtDecode} from 'jwt-decode';
import {Roles} from './utils/types';
import BaseLayout from './views/layout/BaseLayout';

const AuthContext = createContext(null);

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
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(Roles.USER_ANONYMOUS);
  // useEffect(() => {
  //   const toDo = async () => {
  //     const getToken = await Utils.getDataFromKey('token');
  //     setToken(getToken);
  //     try {
  //       const tokenDecoded = jwtDecode(getToken) || {};
  //       if (!tokenDecoded.currentUser) {
  //         setIsLoggedIn(false);
  //         setRole(Roles.USER_ANONYMOUS);
  //         await Utils.clearAll();
  //         return;
  //       }
  //       setIsLoggedIn(true);
  //       setRole(tokenDecoded.currentUser.role);
  //       await Utils.setData('token', getToken);
  //       await Utils.setData('data', tokenDecoded);
  //       setLoadingAuth(false);
  //     } catch (e) {
  //       setIsLoggedIn(false);
  //       setRole(Roles.USER_ANONYMOUS);
  //       await Utils.clearAll();
  //       setLoadingAuth(false);
  //     }
  //   };
  //   toDo();
  // }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await Utils.getDataFromKey('token');
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
  }, []);
  return loadingAuth ? (
    <BaseLayout>
      <View />
    </BaseLayout>
  ) : (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? renderLoggedInScreens(role) : renderLoggedOutScreens()}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
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

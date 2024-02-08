import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import styles from '../../assets/styles/style';
import background from '../../assets/background.jpg';
import React, {useEffect, useState} from 'react';
import {useLoading} from '../../contexts/LoadingScreenContext';

const BaseLayout = ({children}) => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const {isLoading, setIsLoading} = useLoading();

  return (
    <ImageBackground
      source={background}
      style={styles.index}
      resizeMode="cover">
      <View style={styles.overlay}>{children}</View>

      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <></>
      )}
    </ImageBackground>
  );
};

export default BaseLayout;

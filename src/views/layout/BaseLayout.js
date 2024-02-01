import {ImageBackground, StyleSheet, View} from 'react-native';
import styles from '../../assets/styles/style';
import background from '../../assets/background.jpg';

const BaseLayout = ({children}) => {
  return (
    <ImageBackground
      source={background}
      style={styles.index}
      resizeMode="cover">
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

export default BaseLayout;

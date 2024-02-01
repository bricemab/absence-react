import {Button, Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import BaseLayout from '../../layout/BaseLayout';
import {useEffect, useState} from 'react';
import Utils from '../../../utils/utils';

const RegisterPage = ({navigation}) => {
  return (
    <BaseLayout>
      <View>
        <Text style={styles.title}>Bienvenue sur le Module d'absences</Text>
        <Text style={styles.content}>
          Pour configurer votre application afin d'avoir votre QR code, merci de
          cliquer sur le lien reçu par mail
        </Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate('register-key', {key: 'aaa'})}
        />
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 32,
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default RegisterPage;

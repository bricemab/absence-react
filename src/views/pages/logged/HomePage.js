import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import BaseLayout from '../../layout/BaseLayout';
import Utils from '../../../utils/utils';
import QRCode from 'react-native-qrcode-svg';
import dayjs from 'dayjs';
import ExitImage from '../../../assets/entry-red.png';
import EntryImage from '../../../assets/entry-green.png';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import LoggedLayout from '../../layout/LoggedLayout';
import {UtilsTypes} from '../../../utils/types';

const HomePage = ({navigation}) => {
  const [client, setClient] = useState('');
  const [qrcodeValue, setQrcodeValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const netInfo = useNetInfo();

  useEffect(() => {
    const setup = async () => {
      const data = await Utils.getDataFromKey(UtilsTypes.DATA);
      setClient(data.client);
      setQrcodeValue(
        'e3VzZXJLZXk6IjJEMXRIMmZ6ek53ejM0dUkzYmZWZ0FIOThMZ2RmQkZBQ2RiVU53V0Y0enM1V21UekpBIiwgZGV2aWNlS2V5OiJ6aFJ6aHg3QVRwemRlcVI3TWN5dmdLZmdDMnByRXk3UldsSXRSZE56Vm1oM3VMU09NNSIsIHRpbWU6ICIyMDI0LTAyLTA0MDI6MDI6MDIifQ==',
      );
      setToDate(dayjs().format('DD.MM.YYYY'));
      setFromDate(dayjs().format('DD.MM.YYYY'));
    };
    setup().then();
  }, []);
  useEffect(() => {
    // console.log('CONNEXION');
    // console.log(netInfo.type);
    // console.log('isInternetReachable' + netInfo.isInternetReachable);
    // console.log(netInfo.details);
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   console.log('Connection type', state.type);
    //   console.log('Is isInternetReachable?', netInfo.isInternetReachable);
    // });
  }, [netInfo]);
  return (
    <BaseLayout>
      <LoggedLayout>
        <View style={styles.container}>
          <Text style={styles.title}>Certificats d'asbences</Text>
          <Text style={styles.client}>{client}</Text>
          <View style={styles.qrcode}>
            {qrcodeValue !== '' ? (
              <QRCode size={width - 80} value={qrcodeValue} />
            ) : (
              <></>
            )}
          </View>
          <View style={styles.datesContainer}>
            <Text style={styles.dates}>Établie le {fromDate}</Text>
            <Text style={styles.dates}>Jusqu'au {toDate}</Text>
          </View>
          <Pressable style={styles.buttons} onPress={() => {}}>
            <Text style={styles.btnText}>Actualiser</Text>
          </Pressable>
          <Text style={styles.historyText}>Historique</Text>
          <View style={styles.historyContainer}>
            <View style={styles.historyItem}>
              <Image source={ExitImage} style={styles.historyItemImage} />
              <Text style={styles.historyItemText}>
                Salle 304 - 15:15 21.12.2024
              </Text>
            </View>
            <View style={styles.historyItem}>
              <Image source={EntryImage} style={styles.historyItemImage} />
              <Text style={styles.historyItemText}>
                Salle 304 - 15:15 21.12.2024
              </Text>
            </View>
            <View style={styles.historyItem}>
              <Image source={ExitImage} style={styles.historyItemImage} />
              <Text style={styles.historyItemText}>
                Salle 304 - 15:15 21.12.2024
              </Text>
            </View>
          </View>
          <Pressable style={styles.buttons} onPress={() => {}}>
            <Text style={styles.btnText}>Afficher plus</Text>
          </Pressable>
        </View>
      </LoggedLayout>
    </BaseLayout>
  );
};

const height = Dimensions.get('window').height - 100;
const width = Dimensions.get('window').width - 60;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.21,
    shadowRadius: 7.68,
    elevation: 10,
    shadowColor: 'white',
  },
  title: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 32,
  },
  client: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
  datesContainer: {
    marginBottom: 10,
  },
  dates: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
  qrcode: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttons: {
    alignSelf: 'center',
    paddingVertical: 3,
    width: width - 100,
    borderRadius: 5,
    backgroundColor: 'black',
    color: 'white',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
  },
  historyText: {
    marginTop: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
  historyContainer: {
    marginVertical: 10,
  },
  historyItem: {
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  historyItemImage: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    marginRight: 5,
  },
  historyItemText: {
    color: '#000',
    fontWeight: '400',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomePage;

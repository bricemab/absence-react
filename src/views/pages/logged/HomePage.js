import React, {useEffect, useState} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Pressable,
	Image, ScrollView,
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
import {useLoading} from '../../../contexts/LoadingScreenContext';
import {UserErrors} from '../../../utils/CodeErrors';

const HomePage = ({navigation}) => {
	const [client, setClient] = useState('');
	const [qrcodeValue, setQrcodeValue] = useState('');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [isConnected, setIsConnected] = useState(false);
	const [hasCertificate, setHasCertificate] = useState(true);
	const {isConnected: isConnectedRn} = useNetInfo();
	const {setIsLoading} = useLoading();

	const fetchDataOnline = async () => {
		const response = await Utils.postEncodedToBackend('/certificates/load', {});
		if (response.success) {
			const certificate = response.data.certificate;
			await Utils.setData(UtilsTypes.CURRENT_CERTIFICATE, certificate);
			setHasCertificate(true);
		} else {
			if (response.error.code === UserErrors.NOT_CERTIFICATE_PENDING) {
				setHasCertificate(false);
				await Utils.clearData(UtilsTypes.CURRENT_CERTIFICATE);
			}
			console.log('ERROR ON LOAD CERTIFICATES DATA');
		}
		console.log(response);
	};

	const fetchDataOffline = async () => {
		const certificate = await Utils.getDataFromKey(
			UtilsTypes.CURRENT_CERTIFICATE,
		);
		setToDate(dayjs(certificate.toDate).format('DD.MM.YYYY'));
		setFromDate(dayjs(certificate.fromDate).format('DD.MM.YYYY'));
	};

	const checkIfConnected = async () => {
		return new Promise(resolve => {
			NetInfo.fetch().then(async connectionInfo => {
				resolve(setIsConnected(connectionInfo.isConnected));
			});
		});
	};

	const updateQrCode = async () => {
		const data = await Utils.getDataFromKey(UtilsTypes.DATA);
		const certificate = await Utils.getDataFromKey(
			UtilsTypes.CURRENT_CERTIFICATE,
		);
		if (
			dayjs(certificate.toDate).format('YYYY-MM-DD HH:mm:ss') <
			dayjs().format('YYYY-MM-DD HH:mm:ss')
		) {
			await Utils.clearData(UtilsTypes.CURRENT_CERTIFICATE);
			setHasCertificate(false);
		} else {
			const encrypted = Utils.generateQrCodeData(
				data.userKey,
				data.deviceKey,
				certificate.key,
			);
			setQrcodeValue(encrypted);
		}
	};

	const updateData = async () => {
		setIsLoading(true);
		await checkIfConnected();
		if (isConnected) {
			await fetchDataOnline();
		} else {
			await fetchDataOffline();
		}
		const data = await Utils.getDataFromKey(UtilsTypes.DATA);
		const certificate = await Utils.getDataFromKey(
			UtilsTypes.CURRENT_CERTIFICATE,
		);
		setClient(data.client);
		setToDate(dayjs(certificate.toDate).format('DD.MM.YYYY'));
		setFromDate(dayjs(certificate.fromDate).format('DD.MM.YYYY'));
		await updateQrCode();
		setIsLoading(false);
	};

	useEffect(() => {
		const setup = async () => {
			await updateData();
		};
		setup().then();
		const intervalId = setInterval(async () => {
			if (hasCertificate) {
				await updateQrCode();
			}
		}, 10 * 1000);
		return () => clearInterval(intervalId);
	}, [isConnected]);
	return (
		<BaseLayout>
			<LoggedLayout>
				<ScrollView style={styles.container}>
					<View style={styles.viewContainer}>
						<Text style={styles.title}>Certificat d'absence</Text>
						<Text style={styles.client}>{client}</Text>
						{hasCertificate ? (
							<View style={styles.qrcode}>
								{qrcodeValue !== '' ? (
									<QRCode size={width - 80} value={qrcodeValue}/>
								) : (
									<></>
								)}
							</View>
						) : (
							<View style={styles.noQrCode}>
								<Text style={styles.noQrCodeText}>Aucun certificat</Text>
							</View>
						)}
						<View style={styles.datesContainer}>
							<Text style={styles.dates}>
								Établie le {hasCertificate ? fromDate : '--'}
							</Text>
							<Text style={styles.dates}>
								Jusqu'au {hasCertificate ? toDate : '--'}
							</Text>
						</View>
						<Pressable
							style={styles.buttons}
							onPress={async () => {
								console.log('Pressable onPress exécuté');
								setIsLoading(true);
								await updateData();
							}}>
							<Text style={styles.btnText}>Actualiser</Text>
						</Pressable>
						<Text style={styles.historyText}>Historique</Text>
						<View style={styles.historyContainer}>
							<View style={styles.historyItem}>
								<Image source={ExitImage} style={styles.historyItemImage}/>
								<Text style={styles.historyItemText}>
									Salle 304 - 15:15 21.12.2024
								</Text>
							</View>
							<View style={styles.historyItem}>
								<Image source={EntryImage} style={styles.historyItemImage}/>
								<Text style={styles.historyItemText}>
									Salle 304 - 15:15 21.12.2024
								</Text>
							</View>
							<View style={styles.historyItem}>
								<Image source={ExitImage} style={styles.historyItemImage}/>
								<Text style={styles.historyItemText}>
									Salle 304 - 15:15 21.12.2024
								</Text>
							</View>
						</View>
						<Pressable style={styles.buttons} onPress={() => {
						}}>
							<Text style={styles.btnText}>Afficher plus</Text>
						</Pressable>
					</View>
				</ScrollView>
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
	viewContainer: {
		paddingVertical: 20,
	},
	title: {
		color: '#000',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 30,
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
	noQrCode: {
		marginTop: 10,
		marginBottom: 10,
		height: width - 80,
		width: width - 80,
		backgroundColor: 'rgba(0,0,0,0.4)',
		alignSelf: 'center',
		justifyContent: 'center',
	},
	noQrCodeText: {
		color: 'black',
		fontWeight: '500',
		textAlign: 'center',
		fontSize: 20,
	},
	text: {
		fontSize: 20,
		marginBottom: 20,
	},
});

export default HomePage;

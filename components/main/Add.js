import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	Image,
	TouchableOpacity,
	Modal,
	TextInput,
	TouchableHighlight,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Add({ navigation }) {
	const camRef = useRef(null);
	const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [camera, setCamera] = useState(null);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [recording, setRecording] = useState(false);
	const [videoCapturado, setVideoCapturado] = useState(null);
	const [abrirModal, setAbrirModal] = useState(false);

	// Get location
	useEffect(() => {
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		})();
	}, []);

	let text = 'Obteniendo ubicación...';

	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = 'Ubicación localizada, ya puede grabar su reporte...';
	}

	useEffect(() => {
		(async () => {
			const cameraStatus = await Camera.requestPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === 'granted');

			const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
			setHasGalleryPermission(galleryStatus.status === 'granted');
		})();
	}, []);

	const takePicture = async () => {
		if (camera) {
			const data = await camera.takePictureAsync(null);
			setImage(data.uri);
			setAbrirModal(true);
		}
	};

	async function recordVideo() {
		let video;

		if (!recording) {
			setRecording(true);
			const options = { quality: '720p', maxDuration: 30 };
			video = await camRef.current.recodAsync(options);

			setVideoCapturado(video.uri);
			//setAbrirModal(true);
			console.log(video.uri);
		} else {
			setRecording(false);
			camRef.current.stopRecording();
		}
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	if (hasCameraPermission === null || hasGalleryPermission === false) {
		return <View />;
	}
	if (hasCameraPermission === false || hasGalleryPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={{ flex: 1 }}>
			<Camera ref={(ref) => setCamera(ref)} style={styles.fixedRatio} type={type} />

			<View
				style={{
					backgroundColor: '#000',
					flex: 0.4,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{ alignSelf: 'flex-end', flex: 0.1, position: 'absolute' }}
					onPress={() => {
						setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
					}}
				>
					<Ionicons
						style={{ marginRight: 40, paddingBottom: 10, color: 'white' }}
						name="ios-reverse-camera"
						size={38}
						color="white"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						flex: 0.1,
						alignSelf: 'flex-start',
						alignItems: 'center',
						position: 'absolute',
					}}
					onPress={() => {
						setFlash(
							flash === Camera.Constants.FlashMode.torch
								? Camera.Constants.FlashMode.torch
								: Camera.Constants.FlashMode.off
						);
					}}
				>
					<Ionicons
						style={{ marginLeft: 40, paddingBottom: 10, color: 'white' }}
						name={flash ? 'ios-flash' : 'ios-flash-off'}
						size={34}
						color="white"
					/>
				</TouchableOpacity>

				<TouchableOpacity stlye={styles.grabar} onPress={() => takePicture()}>
					<Ionicons style={{ marginBottom: 10, color: '#ef3340' }} name="ios-radio-button-on" size={100} />
				</TouchableOpacity>

				<Text style={{ color: 'white' }}>
					<Ionicons style={{ color: 'white' }} name="ios-navigate" size={15} color="white" />
					{' ' + text}
				</Text>

				<Text style={{ marginTop: 10, fontSize: 14, color: 'white' }}>Explicanos en 30 segundos que sucede...</Text>
			</View>
			{image && (
				<Modal animationType="slide" transparent={true} visible={abrirModal}>
					<View style={{ flex: 1 }}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>Datos necesarios del reporte</Text>

								<DropDownPicker
									items={[
										{ label: 'angellist', value: 'angellist' },
										{ label: 'codepen', value: 'codepen' },
										{ label: 'envelope', value: 'envelope' },
										{ label: 'etsy', value: 'etsy' },
										{ label: 'facebook', value: 'faceboo' },
										{ label: 'foursquare', value: 'foursquare' },
										{ label: 'github-alt', value: 'github-alt' },
										{ label: 'github', value: 'github' },
										{ label: 'gitlab', value: 'gitlab' },
										{ label: 'instagram', value: 'instagrama' },
										{
											label: 'Selecciona una empresa',
											value: 'placeholder',
											selected: true,
											icon: () => <FontAwesome5 name="search" size={18} color="#000" />,
											hidden: true,
										},
									]}
									containerStyle={{ height: 40, alignSelf: 'stretch', marginBottom: 10 }}
									style={{ backgroundColor: '#fafafa', alignSelf: 'center' }}
									itemStyle={{
										justifyContent: 'flex-start',
									}}
									labelStyle={{
										textAlign: 'center',
									}}
									selectedLabelStyle={{ color: '#000000' }}
									dropDownStyle={{ backgroundColor: '#fafafa' }}
									dropDownMaxHeight={400}
									onChangeItem={(item) => setValue(item.value)}
									searchable={true}
									searchablePlaceholder="Busca una ciudad"
									searchablePlaceholderTextColor="gray"
									searchableError={() => <Text>No existe una empresa con ese nombre</Text>}
								/>

								{/* TextInputs to specify which title and categories has */}
								<View styles={styles.reportForms}>
									<TextInput
										style={styles.inputReport}
										placeholder="Titulo del reporte"
										underlineColorAndroid={'transparent'}
									/>

									<TextInput
										style={styles.inputMultipleReport}
										placeholder="Descripción del reporte"
										multiline
										numberOfLines={2}
										underlineColorAndroid={'transparent'}
									/>
								</View>

								{/* View to organize the buttons */}
								<View style={styles.modalBotones}>
									{/* Cancel button */}
									<View style={styles.accionesBotones}>
										<TouchableHighlight
											style={{ ...styles.aceptarVideoBtn }}
											onPress={() => {
												setAbrirModal(false);

												// Enviar datos al JSON correspondiente
												sendInfoToJSON(videoCapturado);
											}}
										>
											<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Aceptar</Text>
										</TouchableHighlight>

										<TouchableHighlight
											style={{ ...styles.cancelarVideoBtn }}
											onPress={() => {
												setAbrirModal(false);
											}}
										>
											<Text style={{ color: '#c42525', fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
										</TouchableHighlight>
									</View>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			)}

			{/*
			<View style={styles.cameraContainer}>
				<Camera ref={(ref) => setCamera(ref)} style={styles.fixedRatio} type={type} ratio={'1:1'} />
			</View>

			<Button
				title="Flip Image"
				onPress={() => {
					setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
				}}
			></Button>
			<Button title="Take Picture" onPress={() => takePicture()} />
			<Button title="Pick Image From Gallery" onPress={() => pickImage()} />
			<Button title="Save" onPress={() => navigation.navigate('Save', { image })} />

			{image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
            */}
		</View>
	);
}

const styles = StyleSheet.create({
	cameraContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	fixedRatio: {
		flex: 1,
		aspectRatio: 1,
	},

	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	boton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#121212',
		margin: 20,
		borderRadius: 10,
		height: 50,
	},
	grabar: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	fondoVisualizacon: {
		flex: 1,
	},
	accionesBotones: {
		flexDirection: 'row',
		alignItems: 'center',
		left: 0,
		bottom: 0,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 5,
		padding: 35,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	modalText: {
		marginBottom: 20,
		fontWeight: 'bold',
		fontSize: 22,
		textAlign: 'center',
	},
	modalBotones: {
		alignContent: 'center',
	},
	aceptarVideoBtn: {
		backgroundColor: '#006600',
		fontWeight: 'bold',
		borderRadius: 3,
		padding: 10,
		paddingHorizontal: 40,
	},
	cancelarVideoBtn: {
		backgroundColor: 'white',
		padding: 10,
	},
	reportForms: {
		alignSelf: 'stretch',
	},
	inputReport: {
		alignSelf: 'stretch',
		height: 40,
		marginBottom: 12,
		color: '#000',
		borderColor: '#e0e0e0',
		borderRadius: 5,
		borderWidth: 1,
	},
	inputMultipleReport: {
		alignSelf: 'stretch',
		height: 65,
		marginBottom: 12,
		color: '#000',
		borderColor: '#e0e0e0',
		borderRadius: 5,
		borderWidth: 1,
	},
});

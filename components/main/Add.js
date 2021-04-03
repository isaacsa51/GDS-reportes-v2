import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function Add({ navigation }) {
	const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [camera, setCamera] = useState(null);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

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

	console.log(location);

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
		}
	};

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
});

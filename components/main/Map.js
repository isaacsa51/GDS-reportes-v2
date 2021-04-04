import React, { useState, useEffect, useRef } from 'react';
import {
	Alert,
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker } from 'react-native-maps';
import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';

let initialState = {
	longitude: null,
	latitude: null,
	latitudeDelta: 0.035,
	longitudeDelta: 0.035,
};

const Map = (props) => {
	const [currentPosition, setCurrentPosition] = useState(initialState);
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [reports, setReports] = useState([]);

	useEffect(() => {
		if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
			props.feed.sort(function (x, y) {
				return x.creation - y.creation;
			});
			setReports(props.feed);
		}
	}, [props.usersFollowingLoaded, props.feed]);

	// Get location
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { longitude, latitude } = position.coords;

				setCurrentPosition({
					...currentPosition,
					latitude,
					longitude,
				});
			},
			(error) => alert(error.message),
			{ timeout: 20000, maximumAge: 1000 }
		);
	}, []);

	const map = useRef(null);

	return currentPosition.latitude ? (
		<SafeAreaView style={styles.container}>
			<MapView
				map={map}
				provider={MapView.PROVIDER_GOOGLE}
				style={styles.map}
				loadingEnabled={true}
				showsUserLocation={true}
				region={currentPosition}
			>
				{reports.map((marker, index) => (
					<Marker
						key={index}
						coordinate={{ latitude: marker.location.coords.latitude, longitude: marker.location.coords.longitude }}
						title={marker.title}
						description={marker.caption}
					/>
				))}
			</MapView>
		</SafeAreaView>
	) : (
		<ActivityIndicator
			size="large"
			style={{
				justifyContent: 'center',
				alignSelf: 'center',
				alignContent: 'center',
			}}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
});

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	following: store.userState.following,
	feed: store.usersState.feed,
	usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Map);

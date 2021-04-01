import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapView from "react-native-maps";

let initialState = {
  longitude: null,
  latitude: null,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
      />
    </SafeAreaView>
  ) : (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Map;

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Linking from "expo-linking";

export default function PostLocation({ navigation, route }) {
  const { postLat, postLong } = route.params;

  // Abrir Google Maps / Apple Maps en el lugar indicado
  const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
  const latLng = `${postLat},${postLong}`;
  const label = "Titulo del reporte";
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  return (
    <View>
      <SafeAreaView style={styles.Container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: postLat,
            longitude: postLong,
            latitudeDelta: 0.0035,
            longitudeDelta: 0.0035,
          }}
        >
          <Marker
            coordinate={{
              latitude: postLat,
              longitude: postLong,
            }}
            title="titulo reporte"
            description="descripcion no sé que"
          >
            <Callout>
              <View style={styles.bubble}>
                <Text style={styles.title}>Titulo reporte</Text>
                <Text style={styles.subTitle}>Descripción</Text>
                <Text style={styles.subTitle}>Dirigido a: [empresa]</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <View style={styles.searchBox}>
          <TouchableOpacity onPress={() => Linking.openURL(url)}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              Vista detallada del lugar...
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  bubble: {
    alignSelf: "center",
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
  },
  subTitle: {
    fontSize: 20,
    opacity: 0.6,
  },
  btnBack: {
    marginTop: 25,
    padding: 10,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 5,
    alignSelf: "center",
  },
  searchBox: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 40 : 20,
    flexDirection: "row",
    backgroundColor: "#000",
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#101010",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});

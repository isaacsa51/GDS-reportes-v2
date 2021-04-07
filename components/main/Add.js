import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, TouchableHighlight } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
require('firebase/firestore');
require('firebase/firebase-storage');

function Add() {
  const camRef = useRef(null);
  const [value, setValue] = useState('');
  const [hasPermission, setHaspermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoCapturado, setVideoCapturado] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [caption, setCaption] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);

  let arrEmpresas = [];

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
    text = 'Ubicación localizada, ya puede reportar...';
  }

  // Permisos del uso de la camara e ImagePicker

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHaspermission(status === 'granted');
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHaspermission(status === 'granted');
    })();
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      setHaspermission(status === 'granted');
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
      video = await camera.recordAsync(options);
      setVideoCapturado(video.uri);
      setAbrirModal(true);
      console.log(video.uri);
    } else {
      setRecording(false);
      camera.stopRecording();
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

  // SUBIR IMAGEN A FIREBASE
  const uploadImage = async () => {
    const photo = image;
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(photo);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  // SUBIR VIDEO A FIREBASE
  const uploadVideo = async () => {
    const video = videoCapturado;
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(video);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid).collection('userPosts').add({
      downloadURL,
      value,
      titulo,
      caption,
      status: 'PENDIENTE',
      likesCount: 0,
      location,
      creation: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // DECIR AL USUARIO QUE YA PUEDE SALIR YA QUE SE SUBIÓ EL REPORTE
  };

  const getCompanies = () => {
    firebase
      .firestore()
      .collection('empresas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          return arrEmpresas.push(doc.data().nombre);
        });
      });
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text style={{ color: 'red' }}>HOLAAAA</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return <Text>Acceso denegado!</Text>;
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
            name="camera-reverse"
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

        <TouchableOpacity stlye={styles.grabar} onPress={recordVideo}>
          <Ionicons
            style={{ marginBottom: 10, color: '#ef3340' }}
            name={recording ? 'ios-square' : 'ios-radio-button-on'}
            size={100}
          />
        </TouchableOpacity>

        <Text style={{ color: 'white' }}>
          <Ionicons style={{ color: 'white' }} name="ios-navigate" size={15} color="white" />
          {' ' + text}
        </Text>

        <Text style={{ marginTop: 10, fontSize: 14, color: 'white' }}>Explicanos en 30 segundos que sucede...</Text>
      </View>

      {videoCapturado && (
        <Modal animationType="slide" transparent={true} visible={abrirModal}>
          <View style={{ flex: 1 }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Datos necesarios del reporte</Text>

                <DropDownPicker
                  items={[
                    { label: 'CFE', value: 'CFE' },
                    { label: 'Jumapam', value: 'Jumapam' },
                    { label: 'Megacable', value: 'Megacable' },
                    { label: 'TELMEX', value: 'TELMEX' },
                    { label: 'Gobierno Municipal', value: 'Gobierno Municipal' },
                    { label: 'Protección Civil', value: 'Protección Civil' },
                    {
                      label: 'H. Cuerpo Voluntario de Bomberos De Mazatlán',
                      value: 'H. Cuerpo Voluntario de Bomberos De Mazatlán',
                    },
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
                  searchablePlaceholder="Buscar empresas..."
                  searchablePlaceholderTextColor="#aaa"
                  searchableError={() => <Text>No existe una empresa con ese nombre</Text>}
                />

                {/* TextInputs to specify which title and categories has */}
                <View styles={styles.reportForms}>
                  <TextInput
                    style={styles.inputReport}
                    placeholder="Titulo del reporte"
                    underlineColorAndroid={'transparent'}
                    onChangeText={(titulo) => setTitulo(titulo)}
                  />

                  <TextInput
                    style={styles.inputMultipleReport}
                    placeholder="Descripción del reporte"
                    multiline
                    numberOfLines={2}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(caption) => setCaption(caption)}
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
                        uploadVideo();
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Aceptar</Text>
                    </TouchableHighlight>

                    <TouchableOpacity
                      style={{ ...styles.cancelarVideoBtn }}
                      onPress={() => {
                        setAbrirModal(false);
                      }}
                    >
                      <Text style={{ color: '#c42525', fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    marginLeft: 10,
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

const mapStateToProps = (store) => ({
  empresas: store.empresasState.add,
});

export default connect(mapStateToProps, null)(Add);

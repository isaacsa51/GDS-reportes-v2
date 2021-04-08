import React, { Component } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import firebase from 'firebase';
import 'firebase/firestore';

export class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
      lastName: '',
      phone: '',
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, name, lastName, phone } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
          name,
          lastName,
          email,
          phone,
        });
        console.log(result);
        alert('Cuenta creada con éxito!');
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#2D4728',
              alignSelf: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            Modificar información
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name="user" size={25} color="#666" />
            </View>
            <TextInput
              onChangeText={(name) => this.setState({ name })}
              style={styles.input}
              numberOfLines={1}
              placeholder="Nombre(s)"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name="user" size={25} color="#666" />
            </View>
            <TextInput
              onChangeText={(lastName) => this.setState({ lastName })}
              style={styles.input}
              numberOfLines={1}
              placeholder="Apellidos"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name="phone" size={25} color="#666" />
            </View>
            <TextInput
              onChangeText={(phone) => this.setState({ phone })}
              keyboardType="phone-pad"
              style={styles.input}
              numberOfLines={1}
              placeholder="Teléfono"
              placeholderTextColor="#666"
            />
          </View>

          {/* Email form */}
          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name="mail" size={25} color="#666" />
            </View>
            <TextInput
              onChangeText={(email) => this.setState({ email })}
              keyboardType="email-address"
              style={styles.input}
              numberOfLines={1}
              placeholder="Email"
              placeholderTextColor="#666"
            />
          </View>

          {/* Password form */}
          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name="lock1" size={25} color="#666" />
            </View>
            <TextInput
              onChangeText={(password) => this.setState({ password })}
              secureTextEntry
              style={styles.input}
              numberOfLines={1}
              placeholder="Contraseña"
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onSignUp()}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 55,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 25,
    color: '#112d4d',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 10,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c76cc',
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: 800 / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: 800 / 1.5,
    height: 800 / 1.5,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },

  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: 800 / 15,
    backgroundColor: '#4F8D41',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default Register;

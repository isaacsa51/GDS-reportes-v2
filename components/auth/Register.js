import React, { Component } from "react";
import {
  View,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";

import firebase from "firebase";
import "firebase/firestore";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
      lastName: "",
      phone: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, name, lastName, phone } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            lastName,
            email,
            phone,
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
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

          <Button onPress={() => this.onSignUp()} title="Sign Up" />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: "cover",
  },
  text: {
    fontSize: 55,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
    color: "#112d4d",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 10,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2c76cc",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: 800 / 15,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  iconStyle: {
    padding: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "#ccc",
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
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
  buttonContainer: {
    marginTop: 50,
    width: "100%",
    height: 800 / 15,
    backgroundColor: "#2c76cc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  buttonContainerSocial: {
    marginTop: 10,
    width: "100%",
    height: 800 / 15,
    padding: 10,
    flexDirection: "row",
    borderRadius: 3,
  },
  iconWrapper: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontWeight: "bold",
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Register;

import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";

import firebase from "firebase";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
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

          <TouchableOpacity
            onPress={() => this.onSignUp()}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
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

  buttonContainer: {
    marginTop: 10,
    width: "100%",
    height: 800 / 15,
    backgroundColor: "#000",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default Login;

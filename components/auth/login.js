import React, { Component } from "react";
import { View, Button, TextInput } from "react-native";
import firebase from "firebase";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn() {
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
      <View style={{ padding: 50 }}>
        <TextInput
          placeholder="Email"
          onChangeText={(email) => this.setState({ email })}
        />

        <TextInput
          placeholder="Contrasena"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <Button title="Iniciar sesión" onPress={() => this.onSignIn()} />
      </View>
    );
  }
}

export default Login;

import React, { Component } from "react";
import { View, Button, TextInput } from "react-native";
import firebase from "firebase";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, name } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
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
          placeholder="Nombre"
          onChangeText={(name) => this.setState({ name })}
        />

        <TextInput
          placeholder="Contrasena"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <TextInput
          placeholder="Email"
          onChangeText={(email) => this.setState({ email })}
        />

        <Button title="Registrarse" onPress={() => this.onSignUp()} />
      </View>
    );
  }
}

export default Register;

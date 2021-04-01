import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";

export default function Landing({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView>
        <View style={styles.container}>
          {/* Email form */}
          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name="mail" size={25} color="#666" />
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              numberOfLines={1}
              placeholder="Contraseña"
              placeholderTextColor="#666"
            />
          </View>

          {/* Forgot password button */}
          <Button
            title="Olvidaste tu contraseña?"
            onPress={() => navigation.navigate("ResetPassword")}
          />

          {/* Login button */}
          <Button
            title="Iniciar Sesión"
            onPress={() => signIn(email, password)}
          />

          {/* Create account */}
          <Button
            title="No tienes cuenta? Registrate!"
            onPress={() => navigation.navigate("RegisterScreen")}
          />
        </View>
      </ScrollView>

      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
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

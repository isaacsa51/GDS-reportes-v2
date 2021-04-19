import React, { Component } from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import * as firebase from "firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));
import { LogBox } from "react-native";

// Ignore log notification by message:
LogBox.ignoreLogs(["Warning: ..."]);

// Ignore all log notifications:
LogBox.ignoreAllLogs();

const firebaseConfig = {
  apiKey: "AIzaSyAPShUI9Qca9QrNnzophdAJB2ra9zumlmc",
  authDomain: "reportes-c99dc.firebaseapp.com",
  projectId: "reportes-c99dc",
  storageBucket: "reportes-c99dc.appspot.com",
  messagingSenderId: "295396069033",
  appId: "1:295396069033:web:9ed3ec9cdcaaad8095e3b8",
  measurementId: "G-YE73X51RHH",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentScreen from "./components/main/Comment";
import MapScreen from "./components/main/Map";
import PostLocation from "./components/main/PostLocation";
import SearchScreen from "./components/main/Search";

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <StatusBar barStyle="light-content" />
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Registrarse" }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Inicio de sesión" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false, title: "Inicio" }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
              options={{ headerShown: false, title: "Reportar" }}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Comment"
              component={CommentScreen}
              navigation={this.props.navigation}
              options={{ title: "Comentarios" }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              navigation={this.props.navigation}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              navigation={this.props.navigation}
              options={{ title: "Mapa" }}
            />
            <Stack.Screen
              name="PostLocation"
              component={PostLocation}
              navigation={this.props.navigation}
              options={{ title: "Ubicación del reporte" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;

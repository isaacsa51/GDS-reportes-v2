import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import * as firebase from "firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./redux/reducers";
import LandingScreen from "./components/auth/landing";
import Register from "./components/auth/register";
import MainScreen from "./components/main";
import Login from "./components/auth/login";

const Stack = createStackNavigator();
const store = createStore(rootReducer, applyMiddleware(thunk));

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB-xn51d3wTw4jNTxQZ4_seiJwTHhyVn4",
  authDomain: "reportes-v2-daf71.firebaseapp.com",
  projectId: "reportes-v2-daf71",
  storageBucket: "reportes-v2-daf71.appspot.com",
  messagingSenderId: "951223084149",
  appId: "1:951223084149:web:35b305e55af81a8db2443c",
  measurementId: "G-NKCPKKFFJ6",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export class App extends Component {
  constructor(props) {
    super(props);

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
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShow: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <MainScreen />
      </Provider>
    );
  }
}

export default App;

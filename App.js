import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));

const firebaseConfig = {
	apiKey: 'AIzaSyAB-xn51d3wTw4jNTxQZ4_seiJwTHhyVn4',
	authDomain: 'reportes-v2-daf71.firebaseapp.com',
	projectId: 'reportes-v2-daf71',
	storageBucket: 'reportes-v2-daf71.appspot.com',
	messagingSenderId: '951223084149',
	appId: '1:951223084149:web:e2009ddb5e664a06b2443c',
	measurementId: 'G-YJEWZX4F80',
};

if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';
import MapScreen from './components/main/Map';
import PostLocation from './components/main/PostLocation';

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
				<View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
					<StatusBar barStyle="light-content" />
					<ActivityIndicator size="large" />
				</View>
			);
		}

		if (!loggedIn) {
			return (
				<View>
					<StatusBar barStyle="light-content" />
					<NavigationContainer>
						<Stack.Navigator initialRouteName="Login">
							<Stack.Screen name="Register" component={RegisterScreen} />
							<Stack.Screen name="Login" component={LoginScreen} />
						</Stack.Navigator>
					</NavigationContainer>
				</View>
			);
		}

		return (
			<Provider store={store}>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Main" component={MainScreen} />
						<Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} />
						<Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} />
						<Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} />
						<Stack.Screen name="Mapa" component={MapScreen} navigation={this.props.navigation} />
						<Stack.Screen name="PostLocation" component={PostLocation} navigation={this.props.navigation} />
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		);
	}
}

export default App;

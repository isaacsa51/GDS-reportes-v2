import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Feather, AntDesign, SimpleLineIcons, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import SearchScreen from './main/Search';
import MapScreen from './main/Map';
import EditScreen from './main/Edit';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

export class Main extends Component {
  componentDidMount() {
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#f0edf6"
        inactiveColor="#444"
        barStyle={{ backgroundColor: '#000' }}
        options={{
          tabStyle: {
            backgroundColor: '#000',
          },
          activeTintColor: '#fff',
          style: {
            borderTopWidth: 0,
            borderTopColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: {
              height: 0,
            },
            shadowRadius: 0,
          },
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Feather name={'home'} size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Buscar"
          component={SearchScreen}
          navigation={this.props.navigation}
          options={{
            headerShown: true,
            tabBarIcon: ({ color, size }) => <AntDesign name="search1" color={color} size={24} />,
          }}
        />
        <Tab.Screen
          name="Reportar"
          component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate('Add');
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="plus-box" color={color} size={28} />,
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate('Map');
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => <Feather name="map" size={22} color={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate('Profile', {
                uid: firebase.auth().currentUser.uid,
              });
            },
          })}
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <AntDesign name="user" color={color} size={24} />,
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);

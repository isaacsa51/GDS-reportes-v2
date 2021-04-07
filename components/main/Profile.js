import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';
import { SimpleLineIcons, MaterialCommunityIcons, FontAwesome } from 'react-native-vector-icons';
import { StatusBar } from 'react-native';

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log('does not exist');
          }
        });
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{
          padding: 10,
          width: '100%',
          backgroundColor: '#000',
          height: 150,
        }}
      />
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesome name="user-circle-o" size={150} color="#454545" style={{ marginTop: -75, zIndex: 2 }} />
        <FontAwesome name="circle" size={180} color="#fff" style={{ marginTop: -165, zIndex: 1 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>
          {user.name} {user.lastName}
        </Text>
        <Text style={{ fontSize: 18, fontStyle: 'italic', opacity: 0.6 }}>{user.email}</Text>
      </View>
      <View style={styles.containerInfo}>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <View>
                <TouchableOpacity
                  style={{
                    marginHorizontal: 5,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    padding: 10,
                    borderRadius: 5,
                    borderWidth: 1.5,
                    borderColor: '#4c9e3d',
                  }}
                  onPress={() => onUnfollow()}
                >
                  <SimpleLineIcons name="user-following" size={20} color="#4c9e3d" />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      marginLeft: 6,
                      fontStyle: 'italic',
                      color: '#4c9e3d',
                    }}
                  >
                    Siguiendo
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={{
                    marginHorizontal: 5,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderRadius: 5,
                    borderWidth: 1.5,
                    borderColor: '#999',
                    width: '100%',
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => onFollow()}
                >
                  <SimpleLineIcons name="user-follow" size={20} color="#666" />
                  <Text
                    style={{
                      fontSize: 18,
                      marginLeft: 6,
                      color: '#666',
                    }}
                  >
                    Seguir usuario
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                padding: 20,
                borderColor: '#000',
                backgroundColor: '#fff',
                borderWidth: 2,
                color: '#000',
                borderRadius: 5,
              }}
              onPress={() => alert('me da amsiedad, tamos trabajando en eso:(')}
            >
              <MaterialCommunityIcons name="account-edit" size={24} color="#000" />
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 6 }}>Editar perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#c42525',
                backgroundColor: '#fff',
                width: '100%',
                padding: 20,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => onLogout()}
            >
              <MaterialCommunityIcons name="logout" size={24} color="#c42525" />
              <Text
                style={{
                  color: '#c42525',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 6,
                }}
              >
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomColor: '#000',
          borderBottomWidth: 2,
          paddingTop: 10,
          padding: 6,
          marginBottom: 1,
        }}
      >
        <Text
          style={{
            textTransform: 'uppercase',
            fontSize: 15,
            opacity: 0.45,
            fontWeight: 'bold',
          }}
        >
          Reportes grabados
        </Text>
      </View>

      <FlatList
        numColumns={3}
        horizontal={false}
        data={userPosts}
        style={{ marginBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.containerImage}>
            <View>
              <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 18 }}>Titulo</Text>
              <Text style={{ flexWrap: 'wrap', flexShrink: 1, alignSelf: 'center', fontSize: 18 }}>{item.titulo}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontStyle: 'italic' }}>Empresa</Text>
              <Text style={{ flexWrap: 'wrap', flexShrink: 1, alignSelf: 'center' }}>{item.value}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontStyle: 'italic' }}>Status</Text>
              <Text style={{ flexWrap: 'wrap', flexShrink: 1, alignSelf: 'center' }}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
    padding: 3,
    margin: 2,
    backgroundColor: '#dedede',
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);

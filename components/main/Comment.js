import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Feather } from 'react-native-vector-icons';

import firebase from 'firebase';
require('firebase/firestore');

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions/index';

function Comment(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty('user')) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection('posts')
      .doc(props.route.params.uid)
      .collection('userPosts')
      .doc(props.route.params.postId)
      .collection('comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Comentario publicado!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#4F8D41' }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Aceptar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.cardsWrapper}>
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <View style={styles.commentInfo}>
                  {item.user !== undefined ? <Text style={styles.cardTitle}>{item.user.name}</Text> : null}
                </View>

                <Text style={styles.newDescription}>{item.text}</Text>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.commentWrapper}>
        <View>
          <TextInput
            style={styles.commentInput}
            placeholder="Ingrese su comentario..."
            onChangeText={(text) => setText(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.commentButton}
          underlayColor="transparent"
          onPress={() => {
            onCommentSend();
            setModalVisible(true);
          }}
        >
          <View>
            <Feather name="send" size={22} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#101010',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  cardsWrapper: {
    width: '95%',
    alignSelf: 'center',
  },
  card: {
    height: 70,
    marginVertical: 2,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  cardInfo: {
    flex: 3,
    padding: 10,
  },
  commentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  newInfo: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 12,
  },
  newDescription: {
    marginTop: 3,
    fontSize: 14,
  },
  commentWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    borderBottomColor: '#ebecf4',
    shadowColor: '#454d65',
    shadowOffset: { height: 5 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    zIndex: 10,
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
  },
  commentInput: {
    height: 45,
    justifyContent: 'flex-end',
    padding: 12,
  },
  commentForm: {
    height: 50,
  },
  commentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);

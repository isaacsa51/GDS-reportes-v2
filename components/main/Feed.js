import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, SimpleLineIcons, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';

import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';

function Feed(props, { navigation }) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
			props.feed.sort(function (x, y) {
				return x.creation - y.creation;
			});
			setPosts(props.feed);
		}
	}, [props.usersFollowingLoaded, props.feed]);

	const onLikePress = (userId, postId) => {
		firebase
			.firestore()
			.collection('posts')
			.doc(userId)
			.collection('userPosts')
			.doc(postId)
			.collection('likes')
			.doc(firebase.auth().currentUser.uid)
			.set({});
	};
	const onDislikePress = (userId, postId) => {
		firebase
			.firestore()
			.collection('posts')
			.doc(userId)
			.collection('userPosts')
			.doc(postId)
			.collection('likes')
			.doc(firebase.auth().currentUser.uid)
			.delete();
	};
	return (
		<View style={styles.container}>
			<View style={styles.containerGallery}>
				<FlatList
					numColumns={1}
					horizontal={false}
					showsVerticalScrollIndicator={false}
					snapToInterval={Dimensions.get('window').height - 54}
					snapToAlignment={'start'}
					decelerationRate={'fast'}
					data={posts}
					renderItem={({ item }) => (
						<View style={styles.container}>
							<Image style={styles.image} source={{ uri: item.downloadURL }} />

							<View style={styles.uiContainer}>
								<View style={styles.rightContainer}>
									<TouchableOpacity
										style={styles.iconsContainer}
										onPress={() =>
											props.navigation.navigate('Comment', {
												postId: item.id,
												uid: item.user.uid,
											})
										}
									>
										<AntDesign name={'message1'} size={42} color={'white'} />
									</TouchableOpacity>

									{item.currentUserLike ? (
										<View>
											<AntDesign
												name={'heart'}
												size={42}
												color={'#d32f2f'}
												onPress={() => onDislikePress(item.user.uid, item.id)}
											/>
										</View>
									) : (
										<AntDesign
											name={'hearto'}
											size={42}
											color={'#fff'}
											onPress={() => onLikePress(item.user.uid, item.id)}
										/>
									)}

									<TouchableOpacity
										style={styles.sideStats}
										onPress={() => {
											props.navigation.navigate('PostLocation', {
												// Enviar datos del reporte
												// postLat: post.location.latitude,
												// postLong: post.location.longitude,
											});
										}}
									>
										<SimpleLineIcons name={'location-pin'} size={40} color={'#fff'} />
									</TouchableOpacity>
								</View>

								{/* Bottom Container */}
								<View style={styles.bottomContainer}>
									<Text style={styles.tituloPost}>
										{item.user.name} {item.user.lastName}
									</Text>
									<Text style={styles.descPost}>{item.caption}</Text>

									<View style={styles.btmCategories}>
										<Ionicons name={'md-business'} size={22} color="white" />
										<Text style={styles.categoria}>empresa</Text>

										<MaterialCommunityIcons
											style={{ marginLeft: 15 }}
											name={'comment-question-outline'}
											size={22}
											color="white"
										/>
										<Text style={styles.categoria}>status</Text>
									</View>
								</View>
							</View>
						</View>
					)}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: Dimensions.get('window').height - 54,
	},
	image: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	uiContainer: {
		height: '100%',
		justifyContent: 'flex-end',
	},
	bottomContainer: {
		color: 'white',
		marginLeft: 5,
		marginBottom: 5,
	},
	tituloPost: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 0,
	},
	descPost: {
		color: 'white',
		fontSize: 16,
		fontWeight: '300',
		marginBottom: 5,
	},
	btmCategories: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	categoria: {
		color: 'white',
		fontSize: 16,
		fontWeight: '300',
		marginLeft: 5,
	},

	//Side container
	rightContainer: {
		alignSelf: 'flex-end',
		height: 200,
		justifyContent: 'space-between',
		marginRight: 3,
	},
	profilePicture: {
		width: 48,
		height: 48,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: 'white',
	},
	sideStats: {
		color: 'white',
		alignSelf: 'center',
		fontSize: 16,
	},
	iconsContainer: {
		alignItems: 'center',
	},
});

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	following: store.userState.following,
	feed: store.usersState.feed,
	usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);

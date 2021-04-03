import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from 'react-native-vector-icons';
import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {
	const [users, setUsers] = useState([]);

	const fetchUsers = (search) => {
		firebase
			.firestore()
			.collection('users')
			.where('name', '>=', search)
			.get()
			.then((snapshot) => {
				let users = snapshot.docs.map((doc) => {
					const data = doc.data();
					const id = doc.id;
					return { id, ...data };
				});
				setUsers(users);
			});
	};
	return (
		<View>
			<StatusBar style="dark" />
			<SafeAreaView style={{ marginTop: 25 }}>
				{/* TextInput form */}
				<View style={styles.commentWrapper}>
					<View>
						<TextInput
							style={styles.commentInput}
							onChangeText={(search) => fetchUsers(search)}
							placeholder="Busca un usuario..."
						/>
					</View>
					<TouchableOpacity style={styles.commentButton} underlayColor="transparent">
						<View>
							<Feather name="search" size={22} color="#000" />
						</View>
					</TouchableOpacity>
				</View>

				<View style={{ marginVertical: 10, marginHorizontal: 12 }}>
					<FlatList
						numColumns={1}
						horizontal={false}
						data={users}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									props.navigation.navigate('Profile', { uid: item.id });
								}}
							>
								<View style={styles.cardsWrapper}>
									<View style={styles.card}>
										<View style={styles.cardInfo}>
											<View style={styles.commentInfo}>
												<Text style={styles.cardTitle}>
													{item.name} {item.lastName}
												</Text>
												<Feather name="chevron-right" size={16} color="#999" />
											</View>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
			</SafeAreaView>
		</View>
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
		height: 40,
		marginVertical: 2,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5',
	},
	cardInfo: {
		flex: 3,
		padding: 10,
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
		marginHorizontal: 5,
		marginVertical: 10,
		borderRadius: 5,
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
	commentInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	commentInput: {
		height: 40,
		justifyContent: 'flex-end',
		padding: 12,
	},
	commentForm: {
		height: 40,
	},
	commentButton: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row-reverse',
	},
});

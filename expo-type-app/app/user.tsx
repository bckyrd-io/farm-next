import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';

const UserScreen = () => {
	const router = useRouter();

	const handleLogout = () => {
		// Explicitly cast as Href
		router.push('/login' as Href);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome, User!</Text>
			<Button title="Logout" onPress={handleLogout} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		marginBottom: 16,
	},
});

export default UserScreen;

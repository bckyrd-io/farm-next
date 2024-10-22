import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Settings</Text>
			{/* Add settings components here */}
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

export default SettingsScreen;

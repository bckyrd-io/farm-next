import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleLogin = async () => {
		// Example API call (you should replace with your actual API route)
		try {
			// Perform login logic here (e.g., fetch call)
			router.push('/user'); // Navigate to user page on successful login
		} catch (error) {
			console.error('Login failed', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Login</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<Button title="Login" onPress={handleLogin} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	title: {
		fontSize: 24,
		marginBottom: 16,
	},
	input: {
		width: '80%',
		padding: 8,
		marginVertical: 8,
		borderWidth: 1,
		borderRadius: 4,
	},
});

export default LoginScreen;

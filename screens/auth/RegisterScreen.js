// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios'  // Directly importing axios

function RegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const handleRegister = async () => {
        // Simple form validation
        if (password !== rePassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('/auth/register', {
                name: fullName,
                email: email,
                password: password
            });

            if (response.data.success) {
                alert('Registration successful, please login');
                navigation.navigate('SignIn');  // Navigate to login screen after registration
            } else {
                alert(response.data.message);  // Display message from server if not successful
            }
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error);
            alert('Failed to register: ' + (error.response ? error.response.data.message : 'Unknown error'));
        }
    };

    return (
        <ImageBackground 
            source={require('../../assets/max-bender-iF5odYWB_nQ-unsplash.jpg')} // Ensure this path is correct
            style={styles.fullScreenBackground}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Register</Text>
                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor="white"
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="white"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="white"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Reenter Password"
                        placeholderTextColor="white"
                        secureTextEntry
                        value={rePassword}
                        onChangeText={setRePassword}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fullScreenBackground: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adding a semi-transparent overlay for better readability
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        padding: 20,
        borderRadius: 5,
    },
    input: {
        width: '100%',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'BebasNeue-Regular'
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Kanit-Medium'
    }
});

export default RegisterScreen;

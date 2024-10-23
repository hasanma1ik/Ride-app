// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        console.log("Password reset link sent to:", email);
        // Implement password reset functionality here
    };

    const buttonColor = email.length > 0 ? '#ff0000' : 'black'; // red if email is entered, otherwise black.

    return (
        <ImageBackground 
            source={require('../assets/max-bender-iF5odYWB_nQ-unsplash.jpg')}
            style={styles.fullScreenBackground}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subTitle}>Please enter your email address to receive a reset link.</Text>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="white"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor}]} 
                    
                    onPress={handleResetPassword}
                    disabled={email.length === 0} // Button is disabled if no email is entered
                    >
                        <Text style={styles.buttonText}>Send Reset Link</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'BebasNeue-Regular',
    },
    subTitle: {
        fontSize: 16,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Kanit-Medium',
    },
    button: {
       
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});

export default ForgotPasswordScreen;

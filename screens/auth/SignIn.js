// screens/SignInScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { AuthContext } from '../../components/context/authContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in both email and password.');
        return;
      }
      const { data } = await axios.post('/auth/login', { email, password });
      if (data && data.user) {
        setState((prevState) => {
          const updatedState = {
            ...prevState,
            user: data.user,
            token: data.token,
            isDriver: data.user.isDriver, // Ensure this is correctly set based on the login response
          };
          AsyncStorage.setItem('@auth', JSON.stringify(updatedState));
          return updatedState;
        });
        // navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Login failed', 'Invalid response from server');
      }
    } catch (error) {
      Alert.alert('Login Error', error.response?.data?.message || error.message);
    }
  };

  const buttonColor = email.length > 0 && password.length > 0 ? '#ff0000' : '#000000'; // Dynamic color change

  return (
    <ImageBackground 
      source={require('../../assets/max-bender-iF5odYWB_nQ-unsplash.jpg')}
      style={styles.fullScreenBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.mainTitle}>RideZap</Text>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.textLink} onPress={() => navigation.navigate('ForgotPassword')}>Forget password?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.textLink}>Don't have an account? REGISTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

export default SignInScreen;

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
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'BebasNeue-Regular', // Ensure the font is loaded as previously set up
  },
  mainTitle: {
    fontSize: 42,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Kanit-Medium',  // Ensure the font is loaded as previously set up
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    color: 'white',
    backgroundColor: 'transparent',
    placeholderTextColor: '#ccc',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ff0000', // Button color when active
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Kanit-Medium', // Ensure the font is loaded as previously set up
  },
  textLink: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Kanit-Medium' // Ensure the font is loaded as previously set up
  },
});

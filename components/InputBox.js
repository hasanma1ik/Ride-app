// import React, { useState, useContext } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { AuthContext } from './context/authContext';
// import axios from 'axios'; // Import Axios for API calls
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import

// const InputBox = ({ navigation }) => {
//     const [state, setState] = useContext(AuthContext);

//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     // Determine button color based on the input criteria
//     const buttonColor = email.length > 0 && password.length > 0 ? '#ff0000' : '#000000';
//     const isDisabled = email.length === 0 || password.length === 0;

//     const handleSignIn = async () => {
//         try {
//             // Call your API for login
//             const response = await axios.post('/auth/login', {
//                 email,
//                 password,
//             });

//             // Assuming the API returns user data and a token on successful login
//             if (response.data.success) {
//                 const { user, token } = response.data;

//                 // Update the AuthContext state
//                 setState({ user, token });

//                 // Save user and token to AsyncStorage
//                 await AsyncStorage.setItem('@auth', JSON.stringify({ user, token }));

//                 // Navigate to the main part of your app (Home screen)
//                 navigation.navigate('HomeScreen');
//             } else {
//                 alert('Login failed: ' + response.data.message);
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             alert('Failed to login: ' + (error.response ? error.response.data.message : 'Unknown error'));
//         }
//     };
    
//     return (
//         <View>
//             <TextInput
//                 placeholder="Email"
//                 placeholderTextColor="white"
//                 value={email}
//                 onChangeText={setEmail}
//                 style={styles.input}
//             />
//             <TextInput
//                 placeholder="Password"
//                 placeholderTextColor="white"
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//                 style={styles.input}
//             />
//             <TouchableOpacity 
//                 style={[styles.signInButton, { backgroundColor: buttonColor }]} 
//                 onPress={handleSignIn}
//                 disabled={isDisabled}
//             >
//                 <Text style={styles.buttonText}>Sign In</Text>
//             </TouchableOpacity>
//             <Text style={styles.textLink} onPress={() => navigation.navigate('ForgotPassword')}>Forget password?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//                 <Text style={styles.textLink}>Don't have an account? REGISTER</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     input: {
//         width: '100%',
//         marginVertical: 10,
//         padding: 10,
//         borderWidth: 1,
//         borderColor: 'white',
//         borderRadius: 5,
//         color: 'white',
//         backgroundColor: 'transparent'
//     },
//     signInButton: {
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     textLink: {
//         color: 'white',
//         fontSize: 14,
//         marginTop: 10,
//         textAlign: 'center',
//         fontFamily: 'Kanit-Medium'
//     },
// });

// export default InputBox;

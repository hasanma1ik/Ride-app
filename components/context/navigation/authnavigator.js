// navigation/AuthNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../../../screens/auth/SignIn'
import RegisterScreen from '../../../screens/auth/RegisterScreen'
import ForgotPasswordScreen from '../../../screens/ForgetPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="SignIn">
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
    {/* Add other authentication-related screens */}
  </Stack.Navigator>
);

export default AuthNavigator;

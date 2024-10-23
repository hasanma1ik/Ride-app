// App.js

import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

// Import providers

import { AuthContext, AuthProvider } from './components/context/authContext';
import { SocketProvider } from './components/context/socketcontext';

// Import navigators
import MainNavigator from './components/context/navigation/mainnavigator';
import AuthNavigator from './components/context/navigation/authnavigator';

// Import custom fonts and splash screen handling
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

function App() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': require('./assets/fonts/BebasNeue-Regular.ttf'),
    'Kanit-Medium': require('./assets/fonts/Kanit-Medium.ttf'),
    'MerriweatherSans-VariableFont_wght': require('./assets/fonts/MerriweatherSans-VariableFont_wght.ttf'),
    'outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./assets/fonts/Outfit-SemiBold.ttf'),
    'outfit-bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'merriweather-sans-bold': require('./assets/fonts/MerriweatherSans-Italic-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [state] = useContext(AuthContext);
  const { loading, user } = state;

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SocketProvider>
        {user ? <MainNavigator /> : <AuthNavigator />}
      </SocketProvider>
    </NavigationContainer>
  );
}

export default App;

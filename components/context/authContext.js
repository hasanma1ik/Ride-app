// components/context/authContext.js

import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: '',
    isDriver: false,
  });

  axios.defaults.baseURL = 'http://192.168.99.55:8080/api/v1';

  // Load authentication data from AsyncStorage when the app starts
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@auth');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setState(parsedData);
          // Set default Authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedData.token}`;
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    loadAuthData();
  }, []);

  // Save authentication data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveAuthData = async () => {
      try {
        await AsyncStorage.setItem('@auth', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving auth data:', error);
      }
    };
    if (state.user && state.token) {
      saveAuthData();
    }
  }, [state]);

  const setDriverStatus = (status) => {
    setState((prevState) => ({
      ...prevState,
      isDriver: status,
    }));
  };

  return (
    <AuthContext.Provider value={[state, setState, setDriverStatus]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

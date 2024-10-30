import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TripsScreen from '../screens/TripsScreen';
import AccountScreen from '../screens/AccountScreen';
import CustomTabBar from '../components/customtabbar';  // Assuming CustomTabBar is in the navigation folder
import HomeScreen from '../screens/Home';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Trips" component={TripsScreen}   options={{ headerShown: true, headerStyle: { backgroundColor: '#000' },  headerTitleStyle: { fontFamily: 'Kanit-Medium', fontSize: 28 }, // Sets the header background color to black
          headerTintColor: '#fff', // Sets the header text color to white
        }}
      />
      <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
   
    </Tab.Navigator>
  );
};

export default BottomTabs;

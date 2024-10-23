import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from '../../../Tabs/bottomtab'
import PlanYourTrip from '../../../screens/planyourtrip'
import DriverConfigurationScreen from '../../../screens/driverconfig';
import DriverDashboard from '../../../screens/driverdashboard'
import ActiveRide from '../../../screens/activeride';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator initialRouteName="BottomTabs">
    <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
    <Stack.Screen name="PlanYourTrip" component={PlanYourTrip} options={{ headerShown: false }} />
    <Stack.Screen name="DriverConfiguration" component={DriverConfigurationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="DriverDashboard" component={DriverDashboard} options={{ headerShown: false }} />
    <Stack.Screen name="ActiveRide" component={ActiveRide} options={{ headerShown: false }} />
    {/* Add other screens that should be accessible when logged in */}
  </Stack.Navigator>
);

export default MainNavigator;

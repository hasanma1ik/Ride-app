// AccountScreen.js

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../components/context/authContext';

const AccountScreen = ({ navigation }) => {
  // Use the context
  const [state, setState, setDriverStatus] = useContext(AuthContext);
  const { user, isDriver } = state;
  console.log('User from context:', user);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/icon-1633249_1280.png')} // Replace with your profile image
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user ? user.name : 'John Doe'}</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Account Options */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('RideHistory')}
        >
          <Icon name="history" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Ride History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <Icon name="payment" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('DriverConfiguration')}
        >
          <Icon name="drive-eta" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Driver Configuration</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            if (isDriver) {
              navigation.navigate('DriverDashboard');
            } else {
              Alert.alert(
                'Not a Driver',
                'You are not registered as a RideZap driver.'
              );
            }
          }}
        >
          <Icon name="dashboard" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Driver Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Support')}
        >
          <Icon name="support-agent" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Logout',
                  onPress: () => {
                    setState((prevState) => ({
                      ...prevState,
                      user: null,
                      token: '',
                      isDriver: false,
                    })); // Resetting user state
                    navigation.replace('SignIn'); // Redirect to login page
                  },
                },
              ],
              { cancelable: true }
            );
          }}
        >
          <Icon name="logout" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Changed background to black
  },
  header: {
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 28,
    marginVertical: 10,
    fontFamily: 'outfit-bold',
    color: '#fff', // Changed text color to white
  },
  editProfileButton: {
    backgroundColor: 'maroon',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 2,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Kanit-Medium',
  },
  menuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#333', // Darker divider color
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 20,
    fontFamily: 'Kanit-Medium',
    color: '#fff', // Changed text color to white
  },
});

export default AccountScreen;

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../components/context/authContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const DriverDashboard = () => {
  const [state] = useContext(AuthContext);
  const navigation = useNavigation();

  // Define state variables
  const [earnings, setEarnings] = useState(0);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverData = async () => {
    try {
      // Fetch earnings
      const earningsResponse = await axios.get('/driver/earnings', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setEarnings(earningsResponse.data.earnings);

      // Fetch upcoming rides
      const upcomingRidesResponse = await axios.get('/driver/upcoming-rides', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setUpcomingRides(upcomingRidesResponse.data.upcomingRides || []);

      // Fetch ride history
      const rideHistoryResponse = await axios.get('/driver/ride-history', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setRideHistory(rideHistoryResponse.data.rideHistory || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching driver data:', error);
      setLoading(false);
    }
  };

 // DriverDashboard.js

const fetchNewRideRequests = async () => {
  try {
    const response = await axios.get('/driver/new-rides', {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (response.data.newRides && response.data.newRides.length > 0) {
      setRideRequests(response.data.newRides);
    } else {
      setRideRequests([]); // Clear the ride requests if none are returned
    }
  } catch (error) {
    console.error('Error fetching new rides:', error);
  }
};


  // ... existing code ...

useEffect(() => {
  fetchDriverData();

  // Set up polling for new ride requests
  const interval = setInterval(() => {
    fetchNewRideRequests();
  }, 10000); // Poll every 10 seconds for new ride requests

  // Listen to focus event to refresh data when screen is focused
  const unsubscribe = navigation.addListener('focus', () => {
    fetchDriverData();
  });

  return () => {
    clearInterval(interval);
    unsubscribe();
  };
}, [state.token, navigation]);


  // In acceptRide function in DriverDashboard.js
const acceptRide = async (ride) => {
  try {
    const response = await axios.post(
      '/driver/accept-ride',
      { rideId: ride._id },
      {
        headers: { Authorization: `Bearer ${state.token}` },
      }
    );
    if (response.status === 200) {
      Alert.alert('Ride Accepted', 'You have accepted the ride.');
      // Remove the accepted ride from ride requests
      setRideRequests((prev) => prev.filter((r) => r._id !== ride._id));
      // Navigate to ActiveRide screen with the accepted ride
      navigation.navigate('ActiveRide', { ride: response.data.ride });
    } else {
      Alert.alert('Error', 'Failed to accept the ride.');
    }
  } catch (error) {
    console.error('Error accepting ride:', error);
    Alert.alert('Error', 'Failed to accept the ride.');
  }
};

  

  const declineRide = async (ride) => {
    try {
      await axios.post(
        '/driver/decline-ride',
        { rideId: ride._id },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      Alert.alert('Ride Declined', 'You have declined the ride.');
      setRideRequests((prev) => prev.filter((r) => r._id !== ride._id));
    } catch (error) {
      console.error('Error declining ride:', error);
      Alert.alert('Error', 'Failed to decline the ride.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Your Dashboard!</Text>

      {/* Earnings Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week's Earnings</Text>
        <Text style={styles.earnings}>PKR {earnings}</Text>
      </View>

      {/* Ride Requests */}
      {rideRequests.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>New Ride Requests</Text>
    <FlatList
      data={rideRequests}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => (
        <View style={styles.rideRequestItem}>
          <Text style={styles.rideRequestText}>
            From: {item.pickupLocation.name || `${item.pickupLocation.latitude}, ${item.pickupLocation.longitude}`}
          </Text>
          <Text style={styles.rideRequestText}>
            To: {item.dropoffLocation.name || `${item.dropoffLocation.latitude}, ${item.dropoffLocation.longitude}`}
          </Text>
          <Text style={styles.rideRequestText}>Type: {item.rideType}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => acceptRide(item)} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => declineRide(item)} style={styles.declineButton}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </View>
)}

      {/* Upcoming Rides Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Rides</Text>
        {upcomingRides.length > 0 ? (
          <FlatList
            data={upcomingRides}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.rideItem}>
                <Text style={styles.rideDetails}>
                  Pickup: {item.pickupLocation.latitude}, {item.pickupLocation.longitude}
                </Text>
                <Text style={styles.rideDetails}>
                  Dropoff: {item.dropoffLocation.latitude}, {item.dropoffLocation.longitude}
                </Text>
                <Text style={styles.rideDetails}>Type: {item.rideType}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noRidesText}>No upcoming rides.</Text>
        )}
      </View>

      {/* Ride History Section */}
      <View style={styles.card1}>
      <Text style={styles.cardTitle}></Text>
      <TouchableOpacity onPress={() => navigation.navigate('RideHistory')}>
        <Text style={styles.viewRideHistoryText}>View Ride History</Text>
      </TouchableOpacity>
        {rideHistory.length > 0 ? (
          <FlatList
            data={rideHistory}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.rideItem}>
                <Text style={styles.rideDetails}>
                  {item.date}: {item.pickupLocation.latitude}, {item.pickupLocation.longitude} to {item.dropoffLocation.latitude}, {item.dropoffLocation.longitude} - PKR {item.fare}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noRidesText}></Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="car-repair" size={24} color="#1E90FF" />
          <Text style={styles.actionText}>Vehicle Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="schedule" size={24} color="#1E90FF" />
          <Text style={styles.actionText}>View Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  viewRideHistoryText: {
    color: '#1E90FF',
    fontSize: 17,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Kanit-Medium'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    // fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Kanit-Medium'
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  card1: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 0,
    marginBottom: 20,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    // fontWeight: 'bold',
    fontFamily: 'Kanit-Medium'
  },
  earnings: {
    color: '#00FF40',
    fontSize: 34,
    fontWeight: 'bold',
  },
  rideItem: {
    marginBottom: 10,
  },
  rideDetails: {
    color: '#fff',
    fontSize: 14,
  },
  noRidesText: {
    color: '#aaa',
    fontSize: 14,
  },
  rideRequestItem: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 10,
  },
  rideRequestText: {
    color: '#fff',
    fontSize: 14,
     fontFamily: 'MerriweatherSans-VariableFont_wght'
    
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Kanit-Medium'
  },
});

export default DriverDashboard;

// ActiveRide.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { AuthContext } from '../components/context/authContext';
import axios from 'axios';

const ActiveRide = ({ route, navigation }) => {
  const { ride } = route.params;
  const [state] = useContext(AuthContext);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [rideStatus, setRideStatus] = useState(ride.status || 'accepted');
  const [loading, setLoading] = useState(true);
  const [fare, setFare] = useState(ride.fare || 'Calculating...');

  useEffect(() => {
    console.log('Ride data in ActiveRide:', ride);
    const fetchData = async () => {
      try {
        const pickup = ride.pickupLocation.name || 'Unknown Pickup Location';
        const dropoff = ride.dropoffLocation.name || 'Unknown Dropoff Location';
        setPickupAddress(pickup);
        setDropoffAddress(dropoff);

        setPassengerName(ride.userId.name || 'Passenger');

        if (!ride.fare) {
          const fareResponse = await axios.get(
            `/driver/calculate-fare/${ride._id}`,
            {
              headers: { Authorization: `Bearer ${state.token}` },
            }
          );
          setFare(fareResponse.data.fare);
        } else {
          setFare(ride.fare);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching ride data:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load ride data.');
      }
    };
    fetchData();
  }, []);

  const handlePickupPassenger = async () => {
    try {
      await axios.post(
        '/driver/start-ride',
        { rideId: ride._id },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      setRideStatus('in_progress');
      Alert.alert('Ride Started', 'Your ride has started.');
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Error', 'Failed to start the ride.');
    }
  };

  const handleDropoffPassenger = async () => {
    try {
      await axios.post(
        '/driver/complete-ride',
        { rideId: ride._id },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      setRideStatus('completed');
      Alert.alert('Ride Completed', 'You have completed the ride.');
      navigation.navigate('DriverDashboard');
    } catch (error) {
      console.error('Error completing ride:', error);
      Alert.alert('Error', 'Failed to complete the ride.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude:
            (ride.pickupLocation.latitude + ride.dropoffLocation.latitude) / 2,
          longitude:
            (ride.pickupLocation.longitude + ride.dropoffLocation.longitude) /
            2,
          latitudeDelta:
            Math.abs(
              ride.pickupLocation.latitude - ride.dropoffLocation.latitude
            ) * 2,
          longitudeDelta:
            Math.abs(
              ride.pickupLocation.longitude - ride.dropoffLocation.longitude
            ) * 2,
        }}
      >
        <Marker
          coordinate={{
            latitude: ride.pickupLocation.latitude,
            longitude: ride.pickupLocation.longitude,
          }}
          title="Pickup Location"
          pinColor="#007AFF"
        />
        <Marker
          coordinate={{
            latitude: ride.dropoffLocation.latitude,
            longitude: ride.dropoffLocation.longitude,
          }}
          title="Dropoff Location"
          pinColor="#34C759"
        />
        <Polyline
          coordinates={[
            {
              latitude: ride.pickupLocation.latitude,
              longitude: ride.pickupLocation.longitude,
            },
            {
              latitude: ride.dropoffLocation.latitude,
              longitude: ride.dropoffLocation.longitude,
            },
          ]}
          strokeColor="#1E90FF"
          strokeWidth={4}
        />
      </MapView>

      {/* Ride Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.passengerName}>
          Passenger: {passengerName}
        </Text>
        <Text style={styles.rideDetails}>
          Ride Type: {ride.rideType}
        </Text>
        <Text style={styles.rideDetails}>
          Pickup: {pickupAddress}
        </Text>
        <Text style={styles.rideDetails}>
          Dropoff: {dropoffAddress}
        </Text>
        <Text style={styles.rideDetails}>
          Payable Amount: PKR {fare}
        </Text>

        {/* Action Buttons */}
        {rideStatus === 'accepted' && (
          <TouchableOpacity
            style={styles.button}
            onPress={handlePickupPassenger}
          >
            <Text style={styles.buttonText}>Pick Up Passenger</Text>
          </TouchableOpacity>
        )}
        {rideStatus === 'in_progress' && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleDropoffPassenger}
          >
            <Text style={styles.buttonText}>Drop Off Passenger</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Set background to black
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#000', // Dark mode background
  },
  passengerName: {
    fontSize: 18,
    fontFamily: 'Kanit-Medium',
    color: '#fff', // White text
    // fontWeight: 'bold',
    marginBottom: 8,
  },
  rideDetails: {
    fontSize: 16,
    fontFamily: 'Kanit-Medium',
    color: '#fff',
    marginVertical: 4,
  },
  button: {
    marginTop: 16,
    backgroundColor: 'red', // Red button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Kanit-Medium',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActiveRide;

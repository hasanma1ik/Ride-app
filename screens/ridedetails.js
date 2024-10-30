// RideDetails.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const RideDetails = ({ route }) => {
  const { ride } = route.params;

  const pickupCoords = {
    latitude: ride.pickupLocation.latitude,
    longitude: ride.pickupLocation.longitude,
  };

  const dropoffCoords = {
    latitude: ride.dropoffLocation.latitude,
    longitude: ride.dropoffLocation.longitude,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (pickupCoords.latitude + dropoffCoords.latitude) / 2,
          longitude: (pickupCoords.longitude + dropoffCoords.longitude) / 2,
          latitudeDelta: Math.abs(pickupCoords.latitude - dropoffCoords.latitude) * 2 || 0.05,
          longitudeDelta: Math.abs(pickupCoords.longitude - dropoffCoords.longitude) * 2 || 0.05,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={pickupCoords} pinColor="#007AFF" title="Pickup Location" />
        <Marker coordinate={dropoffCoords} pinColor="#34C759" title="Destination" />
        <Polyline coordinates={[pickupCoords, dropoffCoords]} strokeColor="#1E90FF" strokeWidth={3} />
      </MapView>

      {/*ils */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Ride Details</Text>

        {/* Date and Time */}
        <View style={styles.detailRow}>
          <Icon name="date-range" size={20} color="#aaa" />
          <Text style={styles.detailText}>
            {new Date(ride.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={20} color="#aaa" />
          <Text style={styles.detailText}>
            {new Date(ride.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Ride Type and Fare */}
        <View style={styles.detailRow}>
          <Icon name="directions-car" size={20} color="#aaa" />
          <Text style={styles.detailText}>Ride Type: {ride.rideType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="attach-money" size={20} color="#aaa" />
          <Text style={styles.detailText}>Amount Paid: PKR {ride.fare}</Text>
        </View>

        {/* Pickup and Destination Indicator */}
        <View style={styles.locationContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.circleBlue} />
            <View style={styles.line} />
            <View style={styles.circleGreen} />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationText}>
              Pickup: {ride.pickupLocation.name || 'Unknown'}
            </Text>
            <Text style={styles.locationText}>
              Destination: {ride.dropoffLocation.name || 'Unknown'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' }, // Black background for the entire screen
  map: {
    width: '100%',
    height: width, // Square map
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#000', // Black background for the details container
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Kanit-Medium',
    marginBottom: 20,
    color: '#fff', // White text color for title
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff', // White text color for details
    fontFamily: 'Kanit-Medium',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  circleBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  line: {
    width: 2,
    height: 25,
    backgroundColor: '#A0A0A0',
    marginVertical: 4,
  },
  circleGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  locationDetails: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#fff', // White text color for pickup and destination
    marginBottom: 10,
    fontFamily: 'Kanit-Medium',

    
  },
});

export default RideDetails;

// Trips.js

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../components/context/authContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Trips = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await axios.get('/rides/user/ride-history', {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        setRides(response.data.rides || []);
      } catch (error) {
        console.error('Error fetching ride history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rideItem}
      onPress={() => navigation.navigate('RideDetails', { ride: item })}
    >
      <View style={styles.row}>
        {/* Small graphic showing pickup and destination */}
        <View style={styles.iconContainer}>
          <View style={styles.circleBlue} />
          <View style={styles.line} />
          <View style={styles.circleGreen} />
        </View>

        {/* Ride Info */}
        <View style={styles.rideInfo}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()} at{' '}
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            From: {item.pickupLocation.name}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            To: {item.dropoffLocation.name}
          </Text>
        </View>

        {/* Fare */}
        <Text style={styles.fareText}>PKR {item.fare}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noRidesText}>No trips available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  rideItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#2c2c2e',
    borderBottomWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
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
    height: 46,
    backgroundColor: '#A0A0A0',
  },
  circleGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  rideInfo: { flex: 1 },
  dateText: { fontSize: 16, color: '#FFFFFF' },
  locationText: { fontSize: 14, color: '#A0A0A0', marginTop: 4, fontFamily: 'MerriweatherSans-VariableFont_wght'  },
  fareText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRidesText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Trips;

// RideHistory.js

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

const RideHistory = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await axios.get('/driver/ride-history', {
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
        <Icon name="local-taxi" size={24} color="#1E90FF" />
        <View style={styles.rideInfo}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.rideTypeText}>{item.rideType}</Text>
        </View>
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
      {/* Ride History Heading */}
      <Text style={styles.heading}>Ride History</Text>
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noRidesText}>No ride history available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  heading: {
    fontSize: 24,
    fontFamily: 'Kanit-Medium',
    color: '#fff',
    textAlign: 'left',
    marginHorizontal: 30,
    marginVertical: 16,
  },
  rideItem: {
    backgroundColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#2c2c2e',
    borderBottomWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rideInfo: { flex: 1, marginLeft: 16 },
  dateText: { fontSize: 16, color: '#fff',  fontFamily: 'Kanit-Medium' },
  rideTypeText: { fontSize: 14, color: '#fff', fontFamily: 'Kanit-Medium' },
  fareText: { fontSize: 16, color: '#00FF40', fontFamily: 'Kanit-Medium' },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRidesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RideHistory;


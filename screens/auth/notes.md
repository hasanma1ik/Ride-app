```  js

const Ride = require('../models/ridemodel');
const Driver = require('../models/DriverModel');

const getEarnings = async (req, res) => {
  try {
    const earnings = await Ride.aggregate([
      { $match: { driverId: req.driver._id, status: 'completed' } },
      { $group: { _id: null, totalEarnings: { $sum: "$fare" } } }
    ]);

    const totalEarnings = earnings[0] ? earnings[0].totalEarnings : 0;

    res.status(200).json({ totalEarnings });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch earnings.', error: error.message });
  }
};

const getUpcomingRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.driver._id, status: 'accepted' }).populate('userId', 'name');
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error fetching upcoming rides:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming rides.', error: error.message });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.driver._id, status: 'completed' }).populate('userId', 'name');
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error fetching ride history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ride history.', error: error.message });
  }
};

const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ride is not pending.' });
    }

    ride.status = 'accepted';
    ride.driverId = req.driver._id;
    await ride.save();

    // Notify passenger (assuming passenger's socketId is stored in User model)
    const passenger = await User.findById(ride.userId);
    if (passenger && passenger.socketId) {
      req.io.to(passenger.socketId).emit('rideAccepted', { ride });
    }

    res.status(200).json({ success: true, message: 'Ride accepted.', ride });
  } catch (error) {
    console.error('Error accepting ride:', error);
    res.status(500).json({ success: false, message: 'Failed to accept ride.', error: error.message });
  }
};

const declineRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ride is not pending.' });
    }

    ride.status = 'declined';
    await ride.save();

    // Optionally, notify passenger
    const passenger = await User.findById(ride.userId);
    if (passenger && passenger.socketId) {
      req.io.to(passenger.socketId).emit('rideDeclined', { ride });
    }

    res.status(200).json({ success: true, message: 'Ride declined.', ride });
  } catch (error) {
    console.error('Error declining ride:', error);
    res.status(500).json({ success: false, message: 'Failed to decline ride.', error: error.message });
  }
};

module.exports = {
  getEarnings,
  getUpcomingRides,
  getRideHistory,
  acceptRide,
  declineRide
};






const express = require('express');
const router = express.Router();
const { getEarnings, getUpcomingRides, getRideHistory, acceptRide, declineRide } = require('../controllers/driverController');
const authenticateDriver = require('../middleware/authmiddleware');

router.get('/earnings', authenticateDriver, getEarnings);
router.get('/upcoming-rides', authenticateDriver, getUpcomingRides);
router.get('/ride-history', authenticateDriver, getRideHistory);
router.post('/accept-ride', authenticateDriver, acceptRide);
router.post('/decline-ride', authenticateDriver, declineRide);

module.exports = router;



// client/src/screens/DriverDashboard.js

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../components/context/authContext';

const DriverDashboard = () => {
  const [state, setState] = useContext(AuthContext);
  const [earnings, setEarnings] = useState(null);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Socket.IO
  const socket = io('http://192.168.136.115:8080', { // Replace with your server's IP and port
    query: {
      token: state.token // Send token for authentication if required
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const earningsResponse = await axios.get('/driver/earnings', {
          headers: {
            Authorization: `Bearer ${state.token}` // Send token in headers
          }
        });
        setEarnings(earningsResponse.data);

        const upcomingRidesResponse = await axios.get('/driver/upcoming-rides', {
          headers: {
            Authorization: `Bearer ${state.token}` // Send token in headers
          }
        });
        setUpcomingRides(upcomingRidesResponse.data);

        const rideHistoryResponse = await axios.get('/driver/ride-history', {
          headers: {
            Authorization: `Bearer ${state.token}` // Send token in headers
          }
        });
        setRideHistory(rideHistoryResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [state.token]);

  // Rest of the component code...
};

export default DriverDashboard;





// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Step 1: Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Step 2: Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticateUser;



// middleware/authenticateDriver.js
const jwt = require('jsonwebtoken');
const Driver = require('../models/drivermodel');

const authenticateDriver = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Step 1: Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Step 2: Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    const driver = await Driver.findOne({ userId: decoded._id });

    // Ensure the user is a driver
    if (!driver) {
      return res.status(401).json({ message: 'Unauthorized - No driver profile found' });
    }

    req.driver = driver; // Attach driver to request
    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticateDriver;

// routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const authenticateDriver = require('../middleware/authenticateDriver');
const authenticateUser = require('../middleware/authenticateUser');
const {
  updateDriverConfig,
  getDriverEarnings,
  getUpcomingRides,
  getRideHistory,
  acceptRide,
  declineRide,
} = require('../controllers/driverController');

// Endpoint to update driver configuration (register or update)
router.post('/config', authenticateUser, updateDriverConfig);

// Endpoint to fetch driver earnings
router.get('/earnings', authenticateDriver, getDriverEarnings);

// Endpoint to fetch upcoming rides
router.get('/upcoming-rides', authenticateDriver, getUpcomingRides);

// Endpoint to fetch ride history
router.get('/ride-history', authenticateDriver, getRideHistory);

// Endpoint to accept a ride
router.post('/accept-ride', authenticateDriver, acceptRide);

// Endpoint to decline a ride
router.post('/decline-ride', authenticateDriver, declineRide);

module.exports = router;


// controllers/driverController.js
const Driver = require('../models/drivermodel');
const JWT = require('jsonwebtoken');

const updateDriverConfig = async (req, res) => {
  const { vehicle, isAvailable } = req.body;
  const userId = req.user._id; // From 'authenticateUser' middleware

  try {
    let driver = await Driver.findOne({ userId });
    if (driver) {
      // Update existing driver
      driver.vehicle = vehicle;
      driver.isAvailable = isAvailable;
      await driver.save();
      res.status(200).json(driver);
    } else {
      // Create new driver profile
      driver = new Driver({
        userId,
        vehicle,
        isAvailable,
        socketId: '',
      });
      await driver.save();

      // Generate new token with isDriver: true
      const token = JWT.sign(
        {
          _id: req.user._id,
          role: req.user.role,
          isDriver: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: '27d' }
      );

      res.status(201).json({ driver, token });
    }
  } catch (error) {
    console.error('Error updating driver config:', error);
    res.status(500).json({ message: 'Failed to update driver configuration', error });
  }
};

// Export your controller functions
module.exports = {
  updateDriverConfig,
  // ... other controller functions
};


// client/src/screens/DriverConfigurationScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthContext } from '../components/context/authContext';
import axios from 'axios';

const DriverConfigurationScreen = ({ navigation }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
  });

  // Access the context data
  const [authState, setAuthState, setDriverStatus] = useContext(AuthContext);

  const handleSave = async () => {
    // Ensure user and token are available
    if (!authState.user || !authState.token) {
      Alert.alert('Error', 'User ID or token is missing, please log in again.');
      return;
    }

    const driverData = {
      isAvailable,
      vehicle: vehicleInfo,
      userId: authState.user.id, // Using correct user ID
    };

    try {
      console.log('Sending token:', authState.token); // Log the token for verification

      const response = await axios.post('/driver/config', driverData, {
        headers: {
          Authorization: `Bearer ${authState.token}`, // Ensure token is correctly formatted
        },
      });

      if (response.status === 200 || response.status === 201) {
        const { token } = response.data;

        if (token) {
          // Update token and isDriver status
          setAuthState((prev) => ({
            ...prev,
            token,
            user: {
              ...prev.user,
              isDriver: true,
            },
          }));
        }

        setDriverStatus(true);
        setAuthState((prev) => ({
          ...prev,
          driverInfo: driverData,
          isDriver: true,
        }));
        Alert.alert('Success', 'Driver configuration saved successfully!');
        navigation.goBack();
      } else {
        throw new Error('Failed to save driver configuration');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save driver configuration: ' + error.message);
    }
  };

  // ... rest of your component code
};

export default DriverConfigurationScreen;


// controllers/authController.js
const loginController = async (req, res) => {
  // ... existing code ...

  const driverProfile = await Driver.findOne({ userId: user._id });
  const isDriver = !!driverProfile; // Convert to boolean

  const token = JWT.sign(
    {
      _id: user._id,
      role: user.role,
      isDriver: isDriver,
    },
    process.env.JWT_SECRET,
    { expiresIn: '27d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      isDriver: isDriver,
    },
  });
};



import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../components/context/authContext';
import axios from 'axios';

const DriverDashboard = () => {
  const [state] = useContext(AuthContext);

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
      setEarnings(earningsResponse.data.totalEarnings || 0);

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


  useEffect(() => {
    fetchDriverData();
    const interval = setInterval(() => {
      fetchNewRideRequests();
    }, 10000); // Poll every 10 seconds for new ride requests

    return () => clearInterval(interval);
  }, [state.token]);

  const acceptRide = async (ride) => {
    try {
      await axios.post(
        '/driver/accept-ride',
        { rideId: ride._id },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      Alert.alert('Ride Accepted', 'You have accepted the ride.');
      setRideRequests((prev) => prev.filter((r) => r._id !== ride._id));
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
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome to Your Dashboard!</Text>

      {/* Earnings Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week's Earnings</Text>
        <Text style={styles.earnings}>PKR {earnings}</Text>
      </View>

      {/* New Ride Requests */}
      {rideRequests.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Ride Requests</Text>
          <FlatList
            data={rideRequests}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.rideRequestItem}>
                <Text style={styles.rideRequestText}>
                  From: {item.pickupLocation.latitude}, {item.pickupLocation.longitude}
                </Text>
                <Text style={styles.rideRequestText}>
                  To: {item.dropoffLocation.latitude}, {item.dropoffLocation.longitude}
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ride History</Text>
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
          <Text style={styles.noRidesText}>No ride history available.</Text>
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
    </ScrollView>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    color: '#333',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  earnings: {
    color: '#1E90FF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  rideItem: {
    marginBottom: 10,
  },
  rideDetails: {
    color: '#555',
    fontSize: 16,
    marginBottom: 5,
  },
  noRidesText: {
    color: '#888',
    fontSize: 16,
  },
  rideRequestItem: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  rideRequestText: {
    color: '#555',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    color: '#333',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverDashboard;





// what i want now is that when i book a ride, i want all the drivers to recieve notifications in their driver dashboad, right now i think server is sending notification when i book ride, however when i navigate to driver dashboard, i see no notification, plz help resolve.

















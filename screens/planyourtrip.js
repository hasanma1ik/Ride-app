import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { AuthContext } from '../components/context/authContext';


const locations = [
  { id: '1', name: 'Jinnah International Airport, Karachi', latitude: 24.9036, longitude: 67.1571 },
  { id: '2', name: 'Clifton Beach, Karachi', latitude: 24.8103, longitude: 66.9940 },
  { id: '3', name: 'Aga Khan Hospital, Karachi', latitude: 24.8918, longitude: 67.0748 },
  { id: '4', name: 'Lahore Fort, Lahore', latitude: 31.5881, longitude: 74.3086 },
  { id: '5', name: 'Badshahi Mosque, Lahore', latitude: 31.5883, longitude: 74.3100 },
  { id: '6', name: 'Shaukat Khanum Hospital, Lahore', latitude: 31.4638, longitude: 74.2949 },
  { id: '7', name: 'Faisal Mosque, Islamabad', latitude: 33.7298, longitude: 73.0375 },
  { id: '8', name: 'Centaurus Mall, Islamabad', latitude: 33.7098, longitude: 73.0546 },
  { id: '9', name: 'Pakistan Institute of Medical Sciences, Islamabad', latitude: 33.6850, longitude: 73.0544 },
  { id: '10', name: 'National Hospital, Faisalabad', latitude: 31.4187, longitude: 73.0791 },
  { id: '11', name: 'Ghanta Ghar, Faisalabad', latitude: 31.4181, longitude: 73.0776 },
];

const rideOptions = [
  { id: '1', type: 'RideZap', multiplier: 1, description: 'Affordable everyday rides' },
  { id: '2', type: 'RideZapX', multiplier: 1.5, description: 'Premium rides with extra comfort' },
];



export default function PlanYourTrip() {
  const [state] = useContext(AuthContext);

  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [currentLocationCoords, setCurrentLocationCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isSelectingCurrent, setIsSelectingCurrent] = useState(false);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [selectedRide, setSelectedRide] = useState(rideOptions[0]);
  const [distance, setDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [ridePrices, setRidePrices] = useState({}); 

  const filterLocations = (query) => {
    if (!query) {
      setFilteredLocations([]);
      return;
    }
    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleSelectLocation = (item, type) => {
    if (type === 'current') {
      setCurrentLocation(item.name);
      setCurrentLocationCoords({ latitude: item.latitude, longitude: item.longitude });
    } else {
      setDestination(item.name);
      setDestinationCoords({ latitude: item.latitude, longitude: item.longitude });
    }
    setFilteredLocations([]);
    setIsSelectingCurrent(false);
    setIsSelectingDestination(false);
  };

  const calculateDistance = () => {
    if (currentLocationCoords && destinationCoords) {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Earth's radius in km
      const dLat = toRad(destinationCoords.latitude - currentLocationCoords.latitude);
      const dLon = toRad(destinationCoords.longitude - currentLocationCoords.longitude);
      const lat1 = toRad(currentLocationCoords.latitude);
      const lat2 = toRad(destinationCoords.latitude);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    }
    return 0;
  };

  const calculatePrice = (multiplier) => {
    const baseFare = 50; // Base fare in PKR
    const perKmRate = 30; // Rate per km in PKR
    const calculatedDistance = calculateDistance();
    const price = baseFare + (calculatedDistance * perKmRate * multiplier);
    return Math.max(100, Math.round(price));
  };

  const calculateEstimatedTime = () => {
    const averageSpeed = 40; // Average speed in km/h
    const time = (calculateDistance() / averageSpeed) * 60; // Time in minutes
    return Math.ceil(time);
  };

  // Function to update ride prices for all ride options
  const updateRidePrices = () => {
    const newPrices = {};
    rideOptions.forEach((option) => {
      newPrices[option.type] = calculatePrice(option.multiplier);
    });
    setRidePrices(newPrices);
  };

  // Update prices when both locations are selected
  useEffect(() => {
    if (currentLocationCoords && destinationCoords) {
      setDistance(calculateDistance());
      setEstimatedTime(calculateEstimatedTime());
      updateRidePrices();
    }
  }, [currentLocationCoords, destinationCoords]);

  const onConfirmBooking = async () => {
    if (!state.user || !state.token) {
      Alert.alert("Error", "You need to be logged in to book a ride.");
      return;
    }
  
    try {
      const rideDetails = {
        userId: state.user.id,
        pickupLocation: {
          latitude: currentLocationCoords.latitude,
          longitude: currentLocationCoords.longitude,
          name: currentLocation, // Include the pickup location name
        },
        dropoffLocation: {
          latitude: destinationCoords.latitude,
          longitude: destinationCoords.longitude,
          name: destination, // Include the dropoff location name
        },
        rideType: selectedRide.type,
      };
  
      console.log('Ride Details:', rideDetails);
  
      const response = await axios.post('/rides/request', rideDetails, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
  
      console.log('Booking Response:', response.data);
  
      if (response.data.success) {
        Alert.alert('Booking Confirmed', `Your ${selectedRide.type} is on the way!`, [{ text: 'OK' }]);
        // Reset the form after successful booking
        setCurrentLocation('');
        setDestination('');
        setCurrentLocationCoords(null);
        setDestinationCoords(null);
        setSelectedRide(null);
        setRidePrices({});
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error in onConfirmBooking:', error.response?.data || error.message);
      Alert.alert('Booking Failed', error.response?.data?.message || error.message);
    }
  };
  
  
  
  

  const renderMap = () => {
    if (currentLocationCoords && destinationCoords) {
      return (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (currentLocationCoords.latitude + destinationCoords.latitude) / 2,
            longitude: (currentLocationCoords.longitude + destinationCoords.longitude) / 2,
            latitudeDelta: Math.abs(currentLocationCoords.latitude - destinationCoords.latitude) * 2,
            longitudeDelta: Math.abs(currentLocationCoords.longitude - destinationCoords.longitude) * 2,
          }}
        >
          <Marker
            coordinate={currentLocationCoords}
            title="Current Location"
            pinColor="green"
          />
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="red"
          />
          <Polyline
            coordinates={[currentLocationCoords, destinationCoords]}
            strokeColor="#00BFFF" // Blue color
            strokeWidth={4}
          />
        </MapView>
      );
    }
    return null;
  };

  const renderRideOptions = () => {
    return rideOptions.map((option) => {
      const isSelected = selectedRide && selectedRide.id === option.id;
      return (
        <TouchableOpacity
          key={option.id}
          style={[styles.rideOption, isSelected && styles.selectedRideOption]}
          onPress={() => setSelectedRide(option)}
        >
          <View>
            <Text style={styles.rideType}>{option.type}</Text>
            <Text style={styles.rideDescription}>{option.description}</Text>
          </View>
          <Text style={styles.ridePrice}>PKR {ridePrices[option.type] || 'Calculating...'}</Text>
        </TouchableOpacity>
      );
    });
  };

  React.useEffect(() => {
    setDistance(calculateDistance());
    setEstimatedTime(calculateEstimatedTime());
  }, [currentLocationCoords, destinationCoords, selectedRide]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {!currentLocationCoords || !destinationCoords ? (
        <View style={styles.container}>
          <Text style={styles.heading}>Plan Your Trip</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Icon name="my-location" size={20} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                onFocus={() => {
                  setIsSelectingCurrent(true);
                  setIsSelectingDestination(false);
                }}
                onChangeText={(text) => {
                  setCurrentLocation(text);
                  filterLocations(text);
                }}
                value={currentLocation}
                placeholder="Current Location"
                placeholderTextColor="#999"
              />
            </View>
            {isSelectingCurrent && filteredLocations.length > 0 && (
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectLocation(item, 'current')}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            )}
            <View style={styles.line} />
            <View style={styles.inputContainer}>
              <Icon name="place" size={20} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                onFocus={() => {
                  setIsSelectingDestination(true);
                  setIsSelectingCurrent(false);
                }}
                onChangeText={(text) => {
                  setDestination(text);
                  filterLocations(text);
                }}
                value={destination}
                placeholder="Where to?"
                placeholderTextColor="#999"
                
              />
            </View>
            {isSelectingDestination && filteredLocations.length > 0 && (
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectLocation(item, 'destination')}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          {renderMap()}
          <ScrollView style={styles.detailsContainer}>
            <View style={styles.locationInfo}>
              <TouchableOpacity onPress={() => setCurrentLocationCoords(null)}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.locationTexts}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationName}>{currentLocation}</Text>
              </View>
              <TouchableOpacity onPress={() => setDestinationCoords(null)}>
                <Icon name="edit" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.locationTexts}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationName}>{destination}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Choose a ride</Text>
            {renderRideOptions()}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirmBooking}
            >
              <Text style={styles.confirmButtonText}>Confirm {selectedRide.type}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    flex: 1,
  },
  heading: {
    color: '#fff',
    fontSize: 28,
    // fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Kanit-Medium'
  },
  inputWrapper: {
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,

  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 5,
  },
  suggestionsList: {
    backgroundColor: '#1c1c1e',
    maxHeight: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
  },
  itemText: {
    color: '#fff',
    
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    height: '54%', // Adjust map height as needed
  },
  detailsContainer: {
    backgroundColor: '#000',
    padding: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    
    
  },
  locationTexts: {
    flex: 1,
    marginLeft: 10,
   
  },

  locationLabel: {
    color: '#aaa',
    fontSize: 12,
     
    
  },

  locationName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Kanit-Medium'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 4,
    fontFamily: 'Kanit-Medium',
    marginTop: -20,
    
  },
  rideOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedRideOption: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  rideType: {
    color: '#fff',
    fontSize: 18,
     fontFamily: 'Kanit-Medium'
  },
  rideDescription: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: 'Kanit-Medium'
  },
  ridePrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  confirmButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 3,

  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-bold'
  },
});

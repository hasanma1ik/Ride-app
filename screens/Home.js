import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 24.8607, // Karachi latitude
    longitude: 67.0011, // Karachi longitude
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Example marker for nearby drivers */}
        <Marker
          coordinate={{
            latitude: region.latitude + 0.001,
            longitude: region.longitude + 0.001,
          }}
          >
          <Image
            source={require('../assets/car.png')}
            style={{ width: 30, height: 30 }} // Adjust width and height as needed
            resizeMode="contain"
          />
       </Marker>
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RideZap</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="notifications-none" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('PlanYourTrip')}
      >
        <Text style={styles.searchText}>Where to?</Text>
      </TouchableOpacity>

      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={async () => {
          let location = await Location.getCurrentPositionAsync({});
          setRegion({
            ...region,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }}
      >
        <Icon name="my-location" size={25} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
    elevation: 5,
  },
  searchText: {
    fontSize: 18,
    color: '#000',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    zIndex: 5,
  },
});

export default HomeScreen;

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

  
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Configuration</Text>
      </View>

      {/* Availability */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Available for Rides</Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
          />
        </View>
      </View>

      {/* Vehicle Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Make"
          value={vehicleInfo.make}
          onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, make: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Model"
          value={vehicleInfo.model}
          onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, model: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Year"
          keyboardType="numeric"
          value={vehicleInfo.year}
          onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, year: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="License Plate"
          value={vehicleInfo.licensePlate}
          onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, licensePlate: text })}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Configuration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 18,
  },
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DriverConfigurationScreen;

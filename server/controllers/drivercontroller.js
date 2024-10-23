const Driver = require('../models/drivermodel');
const Ride = require('../models/ridemodel')
const JWT = require('jsonwebtoken')
const mongoose = require('mongoose');



// Register a new driver
const registerDriver = async (req, res) => {
  const { userId, vehicle, isAvailable } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // Check if driver profile already exists
    const existingDriver = await Driver.findOne({ userId });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const newDriver = new Driver({
      userId,
      vehicle,
      isAvailable,
      socketId: '', // Initialize socket ID as null/empty
    });
    await newDriver.save();
    res.status(201).json({ message: 'Driver registered successfully', driver: newDriver });
  } catch (error) {
    console.error('Error registering driver:', error);
    res.status(500).json({ message: 'Failed to register driver', error });
  }
};


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


const getDriverEarnings = async (req, res) => {
  try {
    const driver = req.user; // Use the driver from req.user
    res.status(200).json({ earnings: driver.totalEarnings || 0 });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ message: 'Failed to fetch earnings', error });
  }
};


const getUpcomingRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      driverId: req.user._id,
      status: { $in: ['accepted', 'in_progress'] },
    }).sort({ date: 1 });

    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error fetching upcoming rides:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming rides', error });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({
      driverId: req.user._id,
      status: 'completed',
    }).sort({ date: -1 });

    // Optionally populate pickup and dropoff addresses
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error fetching ride history:', error);
    res.status(500).json({ message: 'Failed to fetch ride history', error });
  }
};

// controllers/driverController.js

const acceptRide = async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    return res.status(400).json({ message: 'Ride ID is required.' });
  }

  try {
    const driver = req.user; // req.user is the driver object
    console.log('Driver in acceptRide:', driver);

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { $set: { status: 'accepted', driverId: driver._id } },
      { new: true }
    ).populate('userId', 'name email'); // Ensure populate works without .lean()

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    console.log('Ride after acceptRide:', ride);

    res.status(200).json({ message: 'Ride accepted successfully.', ride });
  } catch (error) {
    console.error('Error accepting ride:', error);
    res.status(500).json({ message: 'Failed to accept the ride', error: error.message });
  }
};






const declineRide = async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    return res.status(400).json({ message: 'Ride ID is required.' });
  }

  try {
    // Update the ride's status to 'declined'
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { $set: { status: 'declined' } },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    // Optional: Notify the user via Socket.IO that their ride has been declined
    req.io.to(ride.userId.toString()).emit('rideDeclined', { rideId: ride._id });

    res.status(200).json({ message: 'Ride declined successfully.', ride });
  } catch (error) {
    console.error('Error declining ride:', error);
    res.status(500).json({ message: 'Failed to decline the ride', error: error.message });
  }
};

// controllers/driverController.js

const getNewRides = async (req, res) => {
  try {
    const newRides = await Ride.find({
      status: 'pending',
      // Optionally, you can add filters here to match the driver's criteria
    });

    res.status(200).json({ newRides });
  } catch (error) {
    console.error('Error fetching new rides:', error);
    res.status(500).json({ message: 'Failed to fetch new rides', error });
  }
};


const startRide = async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    return res.status(400).json({ message: 'Ride ID is required.' });
  }

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    ride.status = 'in_progress';
    await ride.save();

    res.status(200).json({ message: 'Ride started successfully.', ride });
  } catch (error) {
    console.error('Error starting ride:', error);
    res.status(500).json({ message: 'Failed to start the ride.', error });
  }
};

const completeRide = async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    return res.status(400).json({ message: 'Ride ID is required.' });
  }

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    console.log('Ride data:', ride);

    if (ride.status !== 'in_progress') {
      return res.status(400).json({ message: 'Ride is not in progress.' });
    }

    // Calculate fare if not already calculated
    if (!ride.fare) {
      const fare = calculateFareAmount(ride);
      ride.fare = fare;
    }

    ride.status = 'completed';
    await ride.save();

    // Update driver's earnings
    const driver = await Driver.findById(ride.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    console.log('Driver before updating earnings:', driver);

    driver.totalEarnings = (driver.totalEarnings || 0) + ride.fare;
    await driver.save();

    console.log('Driver after updating earnings:', driver);

    res.status(200).json({ message: 'Ride completed successfully.', ride });
  } catch (error) {
    console.error('Error completing ride:', error);
    res.status(500).json({ message: 'Failed to complete the ride.', error });
  }
};


const calculateFare = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    if (ride.fare) {
      return res.status(200).json({ fare: ride.fare });
    }

    // Calculate fare
    const fare = calculateFareAmount(ride);
    ride.fare = fare;
    await ride.save();

    res.status(200).json({ fare });
  } catch (error) {
    console.error('Error calculating fare:', error);
    res.status(500).json({ message: 'Failed to calculate fare.', error });
  }
};

// Helper function to calculate fare amount
const calculateFareAmount = (ride) => {
  const baseFare = 50; // Base fare in PKR
  const perKmRate = 30; // Rate per km in PKR
  const distance = calculateDistance(
    ride.pickupLocation.latitude,
    ride.pickupLocation.longitude,
    ride.dropoffLocation.latitude,
    ride.dropoffLocation.longitude
  );
  const multiplier = ride.rideType === 'RideZapX' ? 1.5 : 1;
  const fare = baseFare + distance * perKmRate * multiplier;
  return Math.max(100, Math.round(fare));
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};






// Example helper functions (You'll need to implement these based on your data model)
async function calculateEarnings(userId) {
  // This function should return the total earnings of the driver
}

async function fetchUpcomingRides(userId) {
  // This function should return an array of upcoming rides
}

async function fetchRideHistory(userId) {
  
}



module.exports = {
  updateDriverConfig,
  getDriverEarnings,
  getRideHistory,
  registerDriver,
  getUpcomingRides,
  acceptRide,
  getNewRides,
  declineRide,
  calculateFare,
  completeRide,
  startRide
};

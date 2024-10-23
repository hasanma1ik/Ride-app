// controllers/rideController.js

const Ride = require('../models/ridemodel');

// Function to handle ride requests
const requestRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, rideType } = req.body;
    const userId = req.user._id; // Assuming the user is authenticated and middleware sets req.user

    if (!pickupLocation || !dropoffLocation || !rideType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRide = new Ride({
      userId,
      pickupLocation,
      dropoffLocation,
      rideType,
      status: 'pending', // Set the initial status to 'pending'
      createdAt: new Date(),
    });

    await newRide.save();

    res.status(201).json({ success: true, message: 'Ride requested successfully', ride: newRide });
  } catch (error) {
    console.error('Error requesting ride:', error);
    res.status(500).json({ success: false, message: 'Failed to request ride', error: error.message });
  }
};

module.exports = { requestRide };

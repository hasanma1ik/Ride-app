const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true }, // Ensure name field is included
  },
  dropoffLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true }, // Ensure name field is included
  },
  rideType: { type: String, required: true },
  status: { type: String, default: 'pending' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  fare: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ride', rideSchema);


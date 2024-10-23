// models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  socketId: { // To handle real-time updates
    type: String
  },
  vehicle: {
    make: String,
    model: String,
    year: String,
    licensePlate: String
  },
  totalEarnings: { // Add this field
    type: Number,
    default: 0
  }
});

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);

module.exports = Driver;

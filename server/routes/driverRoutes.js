// routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const authenticateDriver = require('../middleware/authmiddleware');
const authenticateUser = require('../middleware/authuser')

const {
  updateDriverConfig,
  getDriverEarnings,
  getUpcomingRides,
  getRideHistory,
  registerDriver,
  acceptRide,
  getNewRides,
  startRide,
  completeRide,
  calculateFare,
  declineRide
} = require('../controllers/drivercontroller');

// Endpoint to update driver configuration

router.get('/new-rides', authenticateDriver, getNewRides);

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
router.post('/start-ride', authenticateDriver, startRide);
router.post('/complete-ride', authenticateDriver, completeRide);
router.get('/calculate-fare/:rideId', authenticateDriver, calculateFare);


router.post('/register', registerDriver);

module.exports = router;


//basically when 
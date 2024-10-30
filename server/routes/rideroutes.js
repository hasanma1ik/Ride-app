const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authuser')
const { requestRide, getUserRideHistory } = require('../controllers/ridecontroller'); // Destructure the controller

router.post('/request', authenticateUser, requestRide);

router.get('/user/ride-history', authenticateUser, getUserRideHistory);

module.exports = router;

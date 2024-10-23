const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authuser')
const { requestRide } = require('../controllers/ridecontroller'); // Destructure the controller

router.post('/request', authenticateUser, requestRide);

module.exports = router;

// middleware/authenticateDriver.js
const jwt = require('jsonwebtoken');
const Driver = require('../models/drivermodel');

const authenticateDriver = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No auth header');
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (!decoded.isDriver) {
      return res.status(401).json({ message: 'Unauthorized - Not a driver' });
    }

    const driver = await Driver.findOne({ userId: decoded._id });
    if (!driver) {
      console.log(`No driver profile found for userId: ${decoded._id}`);
      return res.status(401).json({ message: 'Unauthorized - No driver profile found' });
    }

    req.user = driver; // Attach driver object to req.user
    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticateDriver;







//const socket = io('http://localhost:PORT');
// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Step 1: Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Step 2: Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticateUser;

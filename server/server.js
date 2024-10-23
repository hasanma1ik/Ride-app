const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const Driver = require('./models/drivermodel')
const mongoose = require('mongoose');


dotenv.config();
console.log(process.env.JWT_SECRET);
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/driver", require("./routes/driverRoutes"));
app.use("/api/v1/rides", require("./routes/rideroutes")); // Include ride routes

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// WebSocket logic for real-time features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle driver registration to save socket ID
  socket.on('registerDriver', async ({ driverId }) => {
    console.log(`Driver registered with ID: ${driverId}, socket ID: ${socket.id}`);
    try {
      // Convert driverId to ObjectId using 'new'
      const driverObjectId = new mongoose.Types.ObjectId(driverId);

      const updatedDriver = await Driver.findOneAndUpdate(
        { userId: driverObjectId }, // Use ObjectId for userId
        { socketId: socket.id },
        { new: true }
      );

      if (!updatedDriver) {
        console.log(`Driver not found for userId: ${driverId}`);
      } else {
        console.log(`Driver's socketId updated: ${updatedDriver.socketId}`);
        console.log('Updated driver document:', updatedDriver);
      }
    } catch (error) {
      console.error('Error updating driver socket ID:', error);
    }
  });

  
    // Handle driver disconnection
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      // Optionally, remove or nullify the driver's socketId in the database
      try {
        await Driver.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null }
        );
      } catch (error) {
        console.error('Error during driver disconnect:', error);
      }
    });
  });
  

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgGreen.white);
});
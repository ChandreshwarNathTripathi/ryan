const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Feature Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "XSHostel REST API",
    version: "1.0.0"
  });
});

module.exports = app;
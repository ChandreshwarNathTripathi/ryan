const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Attempt database connection
const connectDB = require("./config/db");
connectDB();

// Initialize Express app
const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Enable JSON and form body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "XSHostel REST API",
    version: "1.0.0",
  });
});

// Import and mount feature routes
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;

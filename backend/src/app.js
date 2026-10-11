const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Allow frontend to communicate with backend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

// Allow Express to parse incoming JSON data
app.use(express.json());

// Allow Express to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Simple health check route to verify backend is running
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "XSHostel REST API",
    version: "1.0.0"
  });
});

// Export app for use in server.js
module.exports = app;

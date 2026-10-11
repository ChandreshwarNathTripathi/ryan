const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Hostel API is running successfully"
  });
});

module.exports = app;
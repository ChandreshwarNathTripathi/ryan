const express = require("express");
const router = express.Router();
const {
  getMyBookings,
  vacateBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// Student allocations ledger
router.get("/my", protect, getMyBookings);

// Room vacating endpoint (supports both :id/cancel and :id/vacate)
router.patch("/:id/cancel", protect, vacateBooking);
router.patch("/:id/vacate", protect, vacateBooking);

module.exports = router;

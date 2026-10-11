const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// Student allocations ledger (supports both /my and /my-bookings)
router.get("/my", protect, bookingController.getMyBookings);
router.get("/my-bookings", protect, bookingController.getMyBookings);

// Booking creation and single booking retrieval
if (bookingController.createBooking) {
  router.post("/", protect, bookingController.createBooking);
}
if (bookingController.getBookingById) {
  router.get("/:id", protect, bookingController.getBookingById);
}

// Room vacating endpoint (supports both :id/cancel and :id/vacate)
const handleCancelOrVacate = bookingController.vacateBooking || bookingController.cancelBooking;
if (handleCancelOrVacate) {
  router.patch("/:id/cancel", protect, handleCancelOrVacate);
  router.patch("/:id/vacate", protect, handleCancelOrVacate);
}

module.exports = router;

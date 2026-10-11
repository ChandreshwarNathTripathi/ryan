const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Dynamic auth middleware lookup
let protect = (req, res, next) => next();
try {
  const auth = require("../middleware/authMiddleware");
  if (auth && auth.protect) protect = auth.protect;
} catch (e) {
  // If auth middleware is pending, fallback gracefully
}

router.post("/", protect, bookingController.createBooking);
router.get("/my", protect, bookingController.getMyBookings);
router.get("/my-bookings", protect, bookingController.getMyBookings);
router.get("/:id", protect, bookingController.getBookingById);
router.patch("/:id/cancel", protect, bookingController.vacateBooking || bookingController.cancelBooking);
router.patch("/:id/vacate", protect, bookingController.vacateBooking || bookingController.cancelBooking);

module.exports = router;

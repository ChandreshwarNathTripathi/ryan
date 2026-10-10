const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validate');

// Public/User protected endpoints
router.post('/', protect, validateBooking, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);

// Admin-only endpoints
router.get('/', protect, admin, getAllBookings);
router.patch('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;

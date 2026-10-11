const Booking = require("../models/Booking");
const { demoStudent } = require("../middleware/authMiddleware");

// In-memory demo allocations for student
let localBookings = [
  {
    _id: "661234567890abcdef100001",
    bookingReference: "HST-2026-A10101",
    user: demoStudent._id,
    roomNumber: "A-101",
    block: "Block A (Boys)",
    sharing: "Double Sharing",
    academicYear: "2026-2027",
    semester: "Fall Semester",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    messPlan: "Standard 4-Meal Plan",
    totalFee: 55000,
    cautionDeposit: 5000,
    status: "confirmed",
  },
  {
    _id: "661234567890abcdef100002",
    bookingReference: "HST-2025-B20402",
    user: demoStudent._id,
    roomNumber: "B-204",
    block: "Block A (Boys)",
    sharing: "Triple Sharing",
    academicYear: "2025-2026",
    semester: "Spring Semester",
    startDate: "2026-01-10",
    endDate: "2026-05-30",
    messPlan: "Special Multi-Cuisine Mess",
    totalFee: 48000,
    cautionDeposit: 5000,
    status: "vacated",
    vacatingDate: "2026-05-30",
    vacatingReason: "Semester completed",
  },
];

// @desc    Get logged in student's allocations
// @route   GET /api/bookings/my
// @access  Private (Student)
const getMyBookings = async (req, res) => {
  try {
    // If MongoDB is connected
    if (Booking.db && Booking.db.readyState === 1) {
      const bookings = await Booking.find({ user: req.user._id }).sort({ startDate: -1 });
      if (bookings && bookings.length > 0) {
        return res.status(200).json({
          success: true,
          count: bookings.length,
          bookings: bookings,
        });
      }
    }

    // Sort newest first
    const sorted = [...localBookings].sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );

    res.status(200).json({
      success: true,
      count: sorted.length,
      bookings: sorted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving allocations",
    });
  }
};

// @desc    Vacate / Cancel room allocation
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Student)
const vacateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { vacatingDate, reason } = req.body;

    if (!vacatingDate) {
      return res.status(400).json({
        success: false,
        message: "Vacating date is required",
      });
    }

    // If MongoDB is connected
    if (Booking.db && Booking.db.readyState === 1) {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Allocation not found",
        });
      }

      // Security check: Student can only vacate their own allocation
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. You can only vacate your own room allocation.",
        });
      }

      booking.status = "vacated";
      booking.vacatingDate = new Date(vacatingDate);
      booking.vacatingReason = reason || "Semester completed";
      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Room vacated successfully",
        booking: booking,
      });
    }

    // In-memory update
    const bookingIndex = localBookings.findIndex(
      (b) => b._id === bookingId || b.bookingReference === bookingId
    );

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    localBookings[bookingIndex].status = "vacated";
    localBookings[bookingIndex].vacatingDate = vacatingDate;
    localBookings[bookingIndex].vacatingReason = reason || "Semester completed";

    res.status(200).json({
      success: true,
      message: "Room vacated successfully",
      booking: localBookings[bookingIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error processing vacate request",
    });
  }
};

module.exports = {
  getMyBookings,
  vacateBooking,
};

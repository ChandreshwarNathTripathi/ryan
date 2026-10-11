const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Generate human-readable hostel allocation ID (e.g. HST-2026-894102)
const generateAllocationId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `HST-2026-${randomNum}`;
};

const bookingController = {
  // POST /api/bookings - Apply for bed allocation
  createBooking: async (req, res) => {
    try {
      const {
        roomId,
        startDate,
        endDate,
        academicYear,
        semester,
        messPlan,
        emergencyContact
      } = req.body;

      const userId = req.user ? req.user._id : req.body.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required"
        });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      const sDate = new Date(startDate);
      const eDate = new Date(endDate);

      // 1. Conflict Check: Same student already holding active bed allocation for same period
      const studentConflict = await Booking.findOne({
        user: userId,
        status: { $in: ["confirmed", "checked_in"] },
        $or: [
          { startDate: { $lte: eDate }, endDate: {$gte: sDate } }
        ]
      });

      if (studentConflict) {
        return res.status(409).json({
          success: false,
          message: "Conflict: You already hold an active hostel bed allocation for this semester term."
        });
      }

      // 2. Conflict Check: Room bed capacity limit
      const activeAllocations = await Booking.countDocuments({
        room: roomId,
        status: { $in: ["confirmed", "checked_in"] },
        $or: [
          { startDate: { $lte: eDate }, endDate: {$gte: sDate } }
        ]
      });

      const maxCapacity = room.capacity || room.totalBeds;
      if (activeAllocations >= maxCapacity) {
        return res.status(409).json({
          success: false,
          message: `Conflict: Room ${room.roomNumber} is fully occupied for the selected term. All ${maxCapacity} beds are allocated.`
        });
      }

      // Step 2: Bursar Fee Calculation
      const baseSemesterFee = room.pricePerSemester;
      let messFee = 18000; // Standard 4-Meal default
      if (messPlan === "Special Diet") messFee = 24000;
      if (messPlan === "Room Only") messFee = 0;
      const cautionDeposit = 5000; // Fixed refundable
      const totalFee = baseSemesterFee + messFee + cautionDeposit;

      // Save Allocation
      const booking = await Booking.create({
        allocationId: generateAllocationId(),
        user: userId,
        room: roomId,
        startDate: sDate,
        endDate: eDate,
        academicYear: academicYear || "2026-2027",
        semester: semester || "Fall Semester",
        messPlan: messPlan || "Standard 4-Meal",
        baseSemesterFee,
        messFee,
        cautionDeposit,
        totalFee,
        emergencyContact,
        status: "confirmed"
      });

      // Step 3: Atomic Bed Counter Update
      room.occupiedBeds = Math.min(maxCapacity, (room.occupiedBeds || 0) + 1);
      if (room.occupiedBeds >= maxCapacity) {
        room.status = "Full";
      }
      await room.save();

      res.status(201).json({
        success: true,
        message: "Bed allocation confirmed successfully",
        data: booking
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/bookings/my-bookings
  getMyBookings: async (req, res) => {
    try {
      const userId = req.user ? req.user._id : req.query.userId;
      const bookings = await Booking.find({ user: userId })
        .populate("room")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/bookings/:id
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("room")
        .populate("user", "name email rollNumber");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Allocation not found"
        });
      }

      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // PATCH /api/bookings/:id/cancel
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Allocation not found"
        });
      }

      if (booking.status === "cancelled" || booking.status === "vacated") {
        return res.status(400).json({
          success: false,
          message: "Allocation is already cancelled or vacated"
        });
      }

      booking.status = "cancelled";
      await booking.save();

      // Decrement occupiedBeds and restore room status
      const room = await Room.findById(booking.room);
      if (room) {
        room.occupiedBeds = Math.max(0, (room.occupiedBeds || 1) - 1);
        room.status = "Available";
        await room.save();
      }

      res.status(200).json({
        success: true,
        message: "Bed allocation released and status restored successfully",
        data: booking
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = bookingController;
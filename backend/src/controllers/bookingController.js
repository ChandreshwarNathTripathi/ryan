const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Apply for Hostel Room Allocation with date verification & fee computation
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests = 1,
      specialRequests,
      paymentMethod,
      messPlan,
      academicYear,
      semester,
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'The selected hostel room could not be found.',
      });
    }

    if (room.status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This hostel room is currently under maintenance / renovation.',
      });
    }

    // Bed capacity check
    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This hostel room has a maximum capacity of ${room.capacity} beds.`,
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Overlapping room allocation check
    const overlappingBooking = await Booking.findOne({
      room: room._id,
      status: { $in: ['confirmed', 'pending'] },
      $and: [
        { checkIn: { $lt: checkOutDate } },
        { checkOut: { $gt: checkInDate } },
      ],
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This hostel room is already allocated for the selected academic session. Please choose another vacant room.',
      });
    }

    // Compute semester / stay duration & fee
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const roomPrice = numberOfNights * room.pricePerNight;
    
    // Mess fee surcharge if mess selected
    let messSurcharge = 0;
    if (messPlan && messPlan !== 'Self-Dining / No Mess') {
      messSurcharge = Math.round(numberOfNights * 15); // $15 / day mess fee
    }
    const taxesAndFees = Math.round(roomPrice * 0.05) + messSurcharge; // 5% campus facility fee + mess
    const totalAmount = roomPrice + taxesAndFees;

    // Unique hostel allocation reference
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingReference = `HST-${new Date().getFullYear()}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingReference,
      user: req.user._id,
      room: room._id,
      academicYear: academicYear || 'Academic Year 2026-2027',
      semester: semester || 'Full Academic Session',
      messPlan: messPlan || 'Standard Veg Mess',
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      specialRequests: specialRequests || '',
      numberOfNights,
      roomPrice,
      taxesAndFees,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'Demo Student Wallet Pay',
    });

    // Update room status
    room.occupiedBeds = Math.min(room.capacity, (room.occupiedBeds || 0) + Number(guests));
    if (room.occupiedBeds >= room.capacity) {
      room.status = 'booked';
    }
    await room.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone studentId course');

    res.status(201).json({
      success: true,
      message: 'Hostel room allocated successfully! Bed confirmed for academic session.',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get allocations of the logged-in student
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get allocation details by ID (Ownership check)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone studentId course guardianName guardianPhone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Hostel allocation record not found.',
      });
    }

    // Ownership check: must be owner or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' && req.user.role !== 'warden'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You do not have permission to view this allocation.',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vacate or cancel room allocation
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Allocation record not found.',
      });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' && req.user.role !== 'warden'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You cannot cancel another student’s room allocation.',
      });
    }

    if (booking.status === 'cancelled' || booking.status === 'vacated') {
      return res.status(400).json({
        success: false,
        message: 'This hostel allocation is already cancelled or vacated.',
      });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Free up room occupied beds
    const room = await Room.findById(booking.room);
    if (room) {
      room.occupiedBeds = Math.max(0, (room.occupiedBeds || 0) - (booking.guests || 1));
      room.status = 'available';
      await room.save();
    }

    const updated = await Booking.findById(booking._id).populate('room');

    res.status(200).json({
      success: true,
      message: 'Room allocation cancelled / vacated successfully. Caution deposit marked for refund.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hostel allocations (Warden/Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.bookingReference = new RegExp(search.trim(), 'i');
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone studentId course')
      .populate('room', 'name roomNumber block category pricePerNight images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hostel allocation status (Warden/Admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Allocation record not found.',
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('user', 'name email studentId')
      .populate('room', 'name roomNumber block');

    res.status(200).json({
      success: true,
      message: 'Allocation status updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};

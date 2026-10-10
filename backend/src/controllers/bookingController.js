const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create a new booking with date overlap verification & server-side pricing
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      paymentMethod,
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'The selected room could not be found.',
      });
    }

    if (room.status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This room is currently under maintenance and cannot be reserved.',
      });
    }

    // Guest capacity check
    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room accommodates a maximum of ${room.capacity} guests. You specified ${guests} guests.`,
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Overlapping reservation check
    // Overlap condition: (existing.checkIn < newCheckOut) AND (existing.checkOut > newCheckIn)
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
        message: 'This room is already reserved for the selected dates. Please select different dates or browse our other luxury suites.',
      });
    }

    // Server-side calculation of nights & total price
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const roomPrice = numberOfNights * room.pricePerNight;
    const taxesAndFees = Math.round(roomPrice * 0.12); // 12% Hospitality & Luxury Tax
    const totalAmount = roomPrice + taxesAndFees;

    // Generate unique human-readable booking reference
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingReference = `XSH-${new Date().getFullYear()}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingReference,
      user: req.user._id,
      room: room._id,
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
      paymentMethod: paymentMethod || 'Demo Card (Instant Simulation)',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed! Your luxury stay at XShotel is reserved.',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of the logged-in user
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

// @desc    Get booking details by ID (Ownership check)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ownership check: must be owner or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You do not have permission to view this reservation.',
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

// @desc    Cancel an eligible booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ownership verification
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You cannot cancel another guest’s reservation.',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Check cancellation eligibility: check-in must be in future (for guests)
    if (req.user.role !== 'admin') {
      const today = new Date();
      if (new Date(booking.checkIn) <= today) {
        return res.status(400).json({
          success: false,
          message: 'Reservations cannot be cancelled on or after the scheduled check-in date. Please contact reception.',
        });
      }
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    const updated = await Booking.findById(booking._id).populate('room');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Demo refund has been initiated.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
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
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber category pricePerNight images')
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

// @desc    Update booking status (Admin only)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('room', 'name roomNumber');

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully.',
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

const Room = require('../models/Room');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering, search, sorting & pagination
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      minPrice,
      maxPrice,
      capacity,
      featured,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status (public defaults to available unless admin specifies)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by capacity
    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Search by name or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { roomNumber: searchRegex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerNight: 1 };
    else if (sort === 'price_desc') sortOption = { pricePerNight: -1 };
    else if (sort === 'capacity_desc') sortOption = { capacity: -1 };
    else if (sort === 'rating_desc') sortOption = { featured: -1, createdAt: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Room.countDocuments(query);
    const rooms = await Room.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID with ratings & reviews
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'The requested room could not be found.',
      });
    }

    // Fetch approved reviews for this room
    const reviews = await Review.find({ room: room._id, status: 'approved' })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
        : 4.8;

    res.status(200).json({
      success: true,
      data: {
        ...room.toObject(),
        reviews,
        reviewCount,
        averageRating: Number(averageRating),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const {
      name,
      roomNumber,
      category,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
      status,
      featured,
    } = req.body;

    // Check duplicate room number
    const existing = await Room.findOne({
      roomNumber: roomNumber.toUpperCase().trim(),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists. Please choose a unique room number.`,
      });
    }

    const room = await Room.create({
      name: name.trim(),
      roomNumber: roomNumber.toUpperCase().trim(),
      category: category || 'Deluxe',
      description,
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      amenities: amenities || ['High-speed Wi-Fi', 'King Bed', 'Room Service'],
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
      status: status || 'available',
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully.',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    const {
      name,
      roomNumber,
      category,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
      status,
      featured,
    } = req.body;

    if (roomNumber && roomNumber.toUpperCase().trim() !== room.roomNumber) {
      const conflict = await Room.findOne({
        roomNumber: roomNumber.toUpperCase().trim(),
      });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `Room number ${roomNumber} is already taken.`,
        });
      }
      room.roomNumber = roomNumber.toUpperCase().trim();
    }

    if (name) room.name = name.trim();
    if (category) room.category = category;
    if (description) room.description = description;
    if (pricePerNight !== undefined) room.pricePerNight = Number(pricePerNight);
    if (capacity !== undefined) room.capacity = Number(capacity);
    if (amenities) room.amenities = amenities;
    if (images && Array.isArray(images) && images.length > 0) room.images = images;
    if (status) room.status = status;
    if (featured !== undefined) room.featured = Boolean(featured);

    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully.',
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // Check if room has active bookings scheduled in the future
    const activeBooking = await Booking.findOne({
      room: room._id,
      status: { $in: ['confirmed', 'pending'] },
      checkOut: { $gte: new Date() },
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active upcoming reservations. Cancel or complete bookings first.',
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Room ${room.roomNumber} has been permanently deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

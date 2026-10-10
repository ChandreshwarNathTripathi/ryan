const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all users with booking statistics (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Attach booking counts
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingCount = await Booking.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          bookingCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or Self)
const getUserById = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only view your own user account.',
      });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const bookingCount = await Booking.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        bookingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status / role (Admin only)
// @route   PATCH /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const { role, status, name, phone } = req.body;

    // Self-lockout prevention
    if (
      user._id.toString() === req.user._id.toString() &&
      status === 'inactive'
    ) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own active admin account.',
      });
    }

    if (role && ['user', 'admin'].includes(role)) {
      user.role = role;
    }

    if (status && ['active', 'inactive'].includes(status)) {
      user.status = status;
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
};

const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all students & staff (Warden/Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { studentId: regex },
        { course: regex },
      ];
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

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingCount = await Booking.countDocuments({ user: u._id });
        const activeAllocation = await Booking.findOne({
          user: u._id,
          status: 'confirmed',
        }).populate('room', 'roomNumber block');

        return {
          ...u.toObject(),
          bookingCount,
          activeRoom: activeAllocation ? `${activeAllocation.room?.block} - #${activeAllocation.room?.roomNumber}` : 'Unallocated',
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
// @access  Private (Admin, Warden, or Self)
const getUserById = async (req, res, next) => {
  try {
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'warden' &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only view your own student profile.',
      });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
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

// @desc    Update user status / role (Warden/Admin)
// @route   PATCH /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    const { role, status, name, phone, course, studentId, guardianName, guardianPhone } = req.body;

    if (
      user._id.toString() === req.user._id.toString() &&
      status === 'inactive'
    ) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own active warden/admin account.',
      });
    }

    if (role) user.role = role;
    if (status) user.status = status;
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (course) user.course = course.trim();
    if (studentId) user.studentId = studentId.trim();
    if (guardianName !== undefined) user.guardianName = guardianName.trim();
    if (guardianPhone !== undefined) user.guardianPhone = guardianPhone.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Student/Staff record updated successfully.',
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

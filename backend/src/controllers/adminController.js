const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get hostel management metrics & summary counts
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

    // Bed capacity calculations
    const bedsAggregation = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalBeds: { $sum: '$capacity' },
          occupiedBeds: { $sum: '$occupiedBeds' },
        },
      },
    ]);
    const totalBeds = bedsAggregation.length > 0 ? bedsAggregation[0].totalBeds : 0;
    const occupiedBeds = bedsAggregation.length > 0 ? bedsAggregation[0].occupiedBeds : 0;
    const availableBeds = Math.max(0, totalBeds - occupiedBeds);

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const totalStudents = await User.countDocuments({ role: { $in: ['user', 'student'] } });

    // Total Hostel Fees collected
    const revenueAggregation = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Average rating
    const ratingAggregation = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const averageRating =
      ratingAggregation.length > 0
        ? Number(ratingAggregation[0].avg.toFixed(1))
        : 4.8;
    const totalReviews = ratingAggregation.length > 0 ? ratingAggregation[0].count : 0;

    res.status(200).json({
      success: true,
      data: {
        rooms: {
          total: totalRooms,
          available: availableRooms,
          maintenance: maintenanceRooms,
          totalBeds,
          occupiedBeds,
          availableBeds,
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings,
          completed: completedBookings,
        },
        users: {
          total: totalStudents,
        },
        financials: {
          totalRevenue,
          currency: 'USD',
        },
        feedback: {
          averageRating,
          totalReviews,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get visual charts & analytics data for Recharts (Hostel Blocks & Fees)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Monthly fee collections (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const revAggr = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: d, $lt: nextMonth },
            paymentStatus: 'paid',
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalAmount' },
            bookingsCount: { $sum: 1 },
          },
        },
      ]);

      const rev = revAggr.length > 0 ? revAggr[0].revenue : 0;
      const count = revAggr.length > 0 ? revAggr[0].bookingsCount : 0;

      monthlyData.push({
        month: monthNames[d.getMonth()],
        revenue: rev,
        bookings: count,
      });
    }

    // 2. Hostel Block / Room Category distribution
    const categoryDistribution = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          count: { $sum: 1 },
          totalBeds: { $sum: '$capacity' },
        },
      },
      {
        $project: {
          name: '$_id',
          count: '$totalBeds',
          _id: 0,
        },
      },
    ]);

    // 3. Status breakdown
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    // 4. Recent Allocations
    const recentBookings = await Booking.find()
      .populate('user', 'name email studentId')
      .populate('room', 'name roomNumber block category')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue: monthlyData,
        roomCategories: categoryDistribution,
        bookingStatuses: statusCounts,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAnalytics,
};

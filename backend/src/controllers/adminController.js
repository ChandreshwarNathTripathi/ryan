const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get dashboard metrics & summary counts
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const totalUsers = await User.countDocuments({ role: 'user' });

    // Calculate total revenue from paid bookings
    const revenueAggregation = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Calculate average review rating
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
          booked: totalRooms - availableRooms - maintenanceRooms,
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings,
          completed: completedBookings,
        },
        users: {
          total: totalUsers,
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

// @desc    Get visual charts & analytics data for Recharts
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Monthly revenue breakdown (last 6 months)
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

    // 2. Room category distribution
    const categoryDistribution = await Room.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricePerNight' },
        },
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 0] },
          _id: 0,
        },
      },
    ]);

    // 3. Booking status breakdown for PieChart
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    // 4. Recent Bookings (top 6)
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name roomNumber category')
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

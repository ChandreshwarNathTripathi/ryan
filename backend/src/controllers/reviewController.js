const Review = require('../models/Review');
const Room = require('../models/Room');

// @desc    Get reviews (Public or Room-specific)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const { roomId, status } = req.query;
    const query = {};

    if (roomId) query.room = roomId;

    // Non-admin queries only receive approved reviews
    if (req.user && req.user.role === 'admin' && status) {
      if (status !== 'All') query.status = status;
    } else {
      query.status = 'approved';
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('room', 'name roomNumber category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a room review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { roomId, rating, comment } = req.body;

    if (!roomId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Room ID, rating (1-5), and a review comment are required.',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'The room you are reviewing does not exist.',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      room: room._id,
      rating: Number(rating),
      comment: comment.trim(),
      status: 'approved',
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name'
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review has been published.',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate review status (Admin only)
// @route   PATCH /api/reviews/:id
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review status. Must be approved, pending, or rejected.',
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    review.status = status;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review has been marked as ${status}.`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    // Owner or admin only
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You cannot delete this review.',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
};

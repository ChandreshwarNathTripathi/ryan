const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, admin, optionalAuth } = require('../middleware/auth');

router.route('/')
  .get(optionalAuth, getReviews)
  .post(protect, createReview);

router.route('/:id')
  .patch(protect, admin, updateReviewStatus)
  .delete(protect, deleteReview);

module.exports = router;

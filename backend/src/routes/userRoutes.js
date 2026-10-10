const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, getUserById);
router.patch('/:id', protect, admin, updateUser);

module.exports = router;

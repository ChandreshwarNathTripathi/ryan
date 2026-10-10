const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, admin } = require('../middleware/auth');
const { validateRoom } = require('../middleware/validate');

router.route('/')
  .get(getRooms)
  .post(protect, admin, validateRoom, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

module.exports = router;

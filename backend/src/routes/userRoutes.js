const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Student profile retrieval
router.get("/profile", protect, getProfile);

// Student profile updating
router.put("/profile", protect, updateProfile);

// Student password updating
router.put("/change-password", protect, changePassword);

module.exports = router;

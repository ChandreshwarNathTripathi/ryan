const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getVisualAnalytics,
  getUsersDirectory,
  toggleUserStatus,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getAdminBookings,
  updateBookingStatus,
  getSettings,
  updateSettings,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All admin routes require authentication and admin/warden authorization
router.use(protect);
router.use(adminOnly);

// 1. Dashboard Metrics & Visual Analytics
router.get("/stats", getDashboardStats);
router.get("/analytics", getVisualAnalytics);

// 2. Student & Staff Directory
router.get("/users", getUsersDirectory);
router.patch("/users/:id/toggle-status", toggleUserStatus);

// 3. Dormitory Management (Room CRUD)
router.get("/rooms", getRooms);
router.post("/rooms", createRoom);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);

// 4. Allocations Ledger Management
router.get("/bookings", getAdminBookings);
router.patch("/bookings/:id/status", updateBookingStatus);

// 5. Hostel Operating Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

module.exports = router;

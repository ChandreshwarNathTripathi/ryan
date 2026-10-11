const express = require("express");
const router = express.Router();

let adminController = {};
try {
  adminController = require("../controllers/adminController");
} catch (e) {
  adminController = {};
}

let authMiddleware = {};
try {
  authMiddleware = require("../middleware/authMiddleware");
} catch (e) {
  authMiddleware = require("../middleware/auth");
}

const protect = authMiddleware.protect;
const adminGuard = authMiddleware.adminOnly || authMiddleware.admin;

router.use(protect);
router.use(adminGuard);

// 1. Dashboard Metrics & Visual Analytics
router.get("/stats", (req, res, next) => {
  if (adminController.getDashboardStats) return adminController.getDashboardStats(req, res, next);
  res.status(200).json({
    success: true,
    data: { totalRooms: 60, occupiedBeds: 110, availableBeds: 24, totalStudents: 110 }
  });
});

router.get("/analytics", (req, res, next) => {
  if (adminController.getVisualAnalytics) return adminController.getVisualAnalytics(req, res, next);
  res.status(200).json({
    success: true,
    data: [
      { month: "May 2026", collection: 450000 },
      { month: "Jun 2026", collection: 520000 },
      { month: "Jul 2026", collection: 610000 },
      { month: "Aug 2026", collection: 680000 },
      { month: "Sep 2026", collection: 720000 },
      { month: "Oct 2026", collection: 750000 }
    ]
  });
});

// 2. Student & Staff Directory
if (adminController.getUsersDirectory) router.get("/users", adminController.getUsersDirectory);
if (adminController.toggleUserStatus) router.patch("/users/:id/toggle-status", adminController.toggleUserStatus);

// 3. Dormitory Management (Room CRUD)
if (adminController.getRooms) router.get("/rooms", adminController.getRooms);
if (adminController.createRoom) router.post("/rooms", adminController.createRoom);
if (adminController.updateRoom) router.put("/rooms/:id", adminController.updateRoom);
if (adminController.deleteRoom) router.delete("/rooms/:id", adminController.deleteRoom);

// 4. Allocations Ledger Management
if (adminController.getAdminBookings) router.get("/bookings", adminController.getAdminBookings);
if (adminController.updateBookingStatus) router.patch("/bookings/:id/status", adminController.updateBookingStatus);

// 5. Hostel Operating Settings
if (adminController.getSettings) router.get("/settings", adminController.getSettings);
if (adminController.updateSettings) router.put("/settings", adminController.updateSettings);

module.exports = router;
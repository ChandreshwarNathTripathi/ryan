const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, (req, res) => {
  res.status(200).json({
    success: true,
    data: { totalRooms: 60, occupiedBeds: 110, availableBeds: 24, totalStudents: 110 }
  });
});

router.get('/analytics', protect, admin, (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { month: 'May 2026', collection: 450000 },
      { month: 'Jun 2026', collection: 520000 },
      { month: 'Jul 2026', collection: 610000 },
      { month: 'Aug 2026', collection: 680000 },
      { month: 'Sep 2026', collection: 720000 },
      { month: 'Oct 2026', collection: 750000 }
    ]
  });
});

module.exports = router;

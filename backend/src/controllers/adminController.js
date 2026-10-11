const Room = require("../models/Room");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Initial Seed Data for Local In-Memory Fallback
let localRooms = [
  {
    _id: "661234567890abcdef200101",
    roomNumber: "A-101",
    block: "Block A (Boys)",
    category: "Double Sharing",
    floor: "1st Floor",
    capacity: 2,
    occupiedBeds: 2,
    pricePerSemester: 55000,
    amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Study Desk", "Personal Wardrobe"],
    curfewTime: "10:00 PM",
    status: "Occupied",
  },
  {
    _id: "661234567890abcdef200102",
    roomNumber: "A-102",
    block: "Block A (Boys)",
    category: "Double Sharing",
    floor: "1st Floor",
    capacity: 2,
    occupiedBeds: 1,
    pricePerSemester: 55000,
    amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Study Desk"],
    curfewTime: "10:00 PM",
    status: "Available",
  },
  {
    _id: "661234567890abcdef200103",
    roomNumber: "A-201",
    block: "Block A (Boys)",
    category: "Triple Sharing",
    floor: "2nd Floor",
    capacity: 3,
    occupiedBeds: 3,
    pricePerSemester: 45000,
    amenities: ["High-Speed Wi-Fi", "Common Bath", "Balcony View"],
    curfewTime: "10:00 PM",
    status: "Occupied",
  },
  {
    _id: "661234567890abcdef200201",
    roomNumber: "B-101",
    block: "Block B (Girls)",
    category: "Double Sharing",
    floor: "1st Floor",
    capacity: 2,
    occupiedBeds: 2,
    pricePerSemester: 55000,
    amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Air Conditioning"],
    curfewTime: "09:30 PM",
    status: "Occupied",
  },
  {
    _id: "661234567890abcdef200202",
    roomNumber: "B-205",
    block: "Block B (Girls)",
    category: "Single",
    floor: "2nd Floor",
    capacity: 1,
    occupiedBeds: 0,
    pricePerSemester: 75000,
    amenities: ["High-Speed Wi-Fi", "Attached Bath", "Mini Refrigerator", "Study Desk"],
    curfewTime: "09:30 PM",
    status: "Available",
  },
  {
    _id: "661234567890abcdef200301",
    roomNumber: "C-301",
    block: "Block C (Scholars)",
    category: "Single",
    floor: "3rd Floor",
    capacity: 1,
    occupiedBeds: 1,
    pricePerSemester: 80000,
    amenities: ["Gigabit Ethernet", "Attached Bath", "AC", "Quiet Zone"],
    curfewTime: "11:00 PM",
    status: "Occupied",
  },
];

let localAdminBookings = [
  {
    _id: "661234567890abcdef100001",
    bookingReference: "HST-2026-A10101",
    studentName: "Chandra Tripathi",
    studentRoll: "STU-2026-1042",
    roomNumber: "A-101",
    block: "Block A (Boys)",
    semester: "Fall Semester",
    messPlan: "Standard 4-Meal Plan",
    totalFee: 55000,
    status: "confirmed",
    createdAt: new Date("2026-10-01"),
  },
  {
    _id: "661234567890abcdef100003",
    bookingReference: "HST-2026-B10102",
    studentName: "Ananya Sharma",
    studentRoll: "STU-2026-1088",
    roomNumber: "B-101",
    block: "Block B (Girls)",
    semester: "Fall Semester",
    messPlan: "Special Multi-Cuisine Mess",
    totalFee: 62000,
    status: "checked_in",
    createdAt: new Date("2026-09-15"),
  },
  {
    _id: "661234567890abcdef100004",
    bookingReference: "HST-2026-C30101",
    studentName: "Karthik Pillai",
    studentRoll: "STU-2026-1120",
    roomNumber: "C-301",
    block: "Block C (Scholars)",
    semester: "Fall Semester",
    messPlan: "Non-Veg Deluxe Mess",
    totalFee: 85000,
    status: "confirmed",
    createdAt: new Date("2026-08-20"),
  },
  {
    _id: "661234567890abcdef100002",
    bookingReference: "HST-2025-B20402",
    studentName: "Chandra Tripathi",
    studentRoll: "STU-2026-1042",
    roomNumber: "A-201",
    block: "Block A (Boys)",
    semester: "Spring Semester",
    messPlan: "Standard 4-Meal Plan",
    totalFee: 48000,
    status: "vacated",
    createdAt: new Date("2026-01-10"),
  },
];

let localUsers = [
  {
    _id: "661234567890abcdef123456",
    name: "Chandra Tripathi",
    email: "student@example.com",
    studentId: "STU-2026-1042",
    course: "B.Tech Computer Science & Engineering",
    phone: "9876543210",
    guardianPhone: "9876501234",
    role: "student",
    status: "active",
  },
  {
    _id: "661234567890abcdef123457",
    name: "Ananya Sharma",
    email: "ananya.s@xshostel.edu",
    studentId: "STU-2026-1088",
    course: "B.Tech Electronics & Communication",
    phone: "9812345678",
    guardianPhone: "9812398765",
    role: "student",
    status: "active",
  },
  {
    _id: "661234567890abcdef123458",
    name: "Karthik Pillai",
    email: "karthik.p@xshostel.edu",
    studentId: "STU-2026-1120",
    course: "M.Tech Data Science & AI",
    phone: "9765432109",
    guardianPhone: "9765412345",
    role: "student",
    status: "active",
  },
  {
    _id: "661234567890abcdef123459",
    name: "Rahul Verma",
    email: "rahul.v@xshostel.edu",
    studentId: "STU-2026-1015",
    course: "B.Tech Mechanical Engineering",
    phone: "9871122334",
    guardianPhone: "9871155667",
    role: "student",
    status: "suspended",
  },
  {
    _id: "661234567890abcdef999999",
    name: "Dr. Alok Verma",
    email: "chiefwarden@xshostel.edu",
    studentId: "WRD-2026-001",
    course: "Hostel Administration",
    phone: "9988776655",
    guardianPhone: "N/A",
    role: "warden",
    status: "active",
  },
];

let localSettings = {
  curfewHours: "10:00 PM",
  messMonthlyRate: 4500,
  cautionDeposit: 5000,
  emergencyDeskContact: "+91 98765 43210",
  lastUpdated: new Date().toISOString(),
};

// 1. GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    let totalRooms = localRooms.length;
    let totalBeds = localRooms.reduce((sum, r) => sum + r.capacity, 0);
    let occupiedBeds = localRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
    let vacantBeds = Math.max(0, totalBeds - occupiedBeds);
    let occupancyRate = totalBeds > 0 ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;
    let activeStudents = localUsers.filter((u) => u.role === "student" && u.status === "active").length;
    let totalRevenue = localAdminBookings.reduce((sum, b) => sum + (Number(b.totalFee) || 0), 0);

    // If MongoDB connected, calculate from database
    if (Room.db && Room.db.readyState === 1) {
      const roomDocs = await Room.find();
      if (roomDocs.length > 0) {
        totalRooms = roomDocs.length;
        totalBeds = roomDocs.reduce((sum, r) => sum + (r.capacity || 0), 0);
        occupiedBeds = roomDocs.reduce((sum, r) => sum + (r.occupiedBeds || 0), 0);
        vacantBeds = Math.max(0, totalBeds - occupiedBeds);
        occupancyRate = totalBeds > 0 ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;
      }

      const userDocs = await User.find({ role: "student", status: "active" });
      if (userDocs.length > 0) activeStudents = userDocs.length;

      const bookingDocs = await Booking.find();
      if (bookingDocs.length > 0) {
        totalRevenue = bookingDocs.reduce((sum, b) => sum + (Number(b.totalFee) || 0), 0);
      }
    }

    res.status(200).json({
      totalRooms,
      totalBeds,
      occupiedBeds,
      vacantBeds,
      occupancyRate,
      activeStudents,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating dashboard metrics" });
  }
};

// 2. GET /api/admin/analytics
const getVisualAnalytics = async (req, res) => {
  try {
    // 6-month fee collections aggregation
    const monthlyRevenue = [
      { month: "2026-05", revenue: 320000, allocations: 6 },
      { month: "2026-06", revenue: 475000, allocations: 9 },
      { month: "2026-07", revenue: 680000, allocations: 13 },
      { month: "2026-08", revenue: 540000, allocations: 10 },
      { month: "2026-09", revenue: 490000, allocations: 9 },
      { month: "2026-10", revenue: 410000, allocations: 8 },
    ];

    // Block capacity & bed distribution
    const blockStats = [
      {
        block: "Block A (Boys)",
        rooms: localRooms.filter((r) => r.block.includes("Block A")).length || 3,
        totalBeds: 7,
        occupiedBeds: 6,
      },
      {
        block: "Block B (Girls)",
        rooms: localRooms.filter((r) => r.block.includes("Block B")).length || 2,
        totalBeds: 3,
        occupiedBeds: 2,
      },
      {
        block: "Block C (Scholars)",
        rooms: localRooms.filter((r) => r.block.includes("Block C")).length || 1,
        totalBeds: 1,
        occupiedBeds: 1,
      },
    ];

    res.status(200).json({
      monthlyRevenue,
      blockStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Error compiling analytics" });
  }
};

// 3. GET /api/admin/users
const getUsersDirectory = async (req, res) => {
  try {
    const { search, role } = req.query;
    let filtered = [...localUsers];

    if (role && role !== "All") {
      filtered = filtered.filter((u) => u.role.toLowerCase() === role.toLowerCase());
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.studentId && u.studentId.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      users: filtered,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student directory" });
  }
};

// 4. PATCH /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const userIndex = localUsers.findIndex((u) => u._id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "Student account not found" });
    }

    const currentStatus = localUsers[userIndex].status;
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    localUsers[userIndex].status = newStatus;

    res.status(200).json({
      message: "User status updated successfully",
      user: {
        id: localUsers[userIndex]._id,
        status: newStatus,
        name: localUsers[userIndex].name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error changing user status" });
  }
};

// 5. Room CRUD Endpoints
const getRooms = async (req, res) => {
  try {
    const { search, block } = req.query;
    let list = [...localRooms];

    if (block && block !== "All") {
      list = list.filter((r) => r.block === block);
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.roomNumber.toLowerCase().includes(q));
    }

    res.status(200).json({ success: true, count: list.length, rooms: list });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

const createRoom = async (req, res) => {
  try {
    const { roomNumber, block, category, floor, capacity, pricePerSemester, amenities, curfewTime } = req.body;

    if (!roomNumber) return res.status(400).json({ message: "Room number is required" });

    const newRoom = {
      _id: "room_" + Date.now(),
      roomNumber,
      block: block || "Block A (Boys)",
      category: category || "Double Sharing",
      floor: floor || "1st Floor",
      capacity: Number(capacity) || 2,
      occupiedBeds: 0,
      pricePerSemester: Number(pricePerSemester) || 55000,
      amenities: amenities || ["High-Speed Wi-Fi", "Attached Bathroom"],
      curfewTime: curfewTime || "10:00 PM",
      status: "Available",
    };

    localRooms.unshift(newRoom);
    res.status(201).json({ success: true, message: "Dormitory created successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Error creating room" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const index = localRooms.findIndex((r) => r._id === roomId);

    if (index === -1) return res.status(404).json({ message: "Room not found" });

    localRooms[index] = {
      ...localRooms[index],
      ...req.body,
      capacity: Number(req.body.capacity) || localRooms[index].capacity,
      pricePerSemester: Number(req.body.pricePerSemester) || localRooms[index].pricePerSemester,
    };

    res.status(200).json({ success: true, message: "Dormitory updated successfully", room: localRooms[index] });
  } catch (error) {
    res.status(500).json({ message: "Error updating room" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    localRooms = localRooms.filter((r) => r._id !== roomId);
    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room" });
  }
};

// 6. Allocations Management
const getAdminBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let list = [...localAdminBookings];

    if (status && status !== "All") {
      list = list.filter((b) => b.status.toLowerCase() === status.toLowerCase());
    }

    res.status(200).json({ success: true, count: list.length, bookings: list });
  } catch (error) {
    res.status(500).json({ message: "Error fetching allocations" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const index = localAdminBookings.findIndex((b) => b._id === bookingId);
    if (index === -1) return res.status(404).json({ message: "Allocation not found" });

    localAdminBookings[index].status = status;
    res.status(200).json({ success: true, message: "Allocation status updated", booking: localAdminBookings[index] });
  } catch (error) {
    res.status(500).json({ message: "Error updating allocation status" });
  }
};

// 7. Settings
const getSettings = async (req, res) => {
  res.status(200).json({ success: true, settings: localSettings });
};

const updateSettings = async (req, res) => {
  const { curfewHours, messMonthlyRate, cautionDeposit, emergencyDeskContact } = req.body;
  if (curfewHours) localSettings.curfewHours = curfewHours;
  if (messMonthlyRate) localSettings.messMonthlyRate = Number(messMonthlyRate);
  if (cautionDeposit) localSettings.cautionDeposit = Number(cautionDeposit);
  if (emergencyDeskContact) localSettings.emergencyDeskContact = emergencyDeskContact;
  localSettings.lastUpdated = new Date().toISOString();

  res.status(200).json({ success: true, message: "Hostel settings updated successfully", settings: localSettings });
};

module.exports = {
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
};

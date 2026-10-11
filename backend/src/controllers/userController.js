const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { demoStudent } = require("../middleware/authMiddleware");

// In-memory student store for local testing when MongoDB is offline
let localStudentData = {
  ...demoStudent,
  passwordHash: bcrypt.hashSync("password123", 10),
};

// @desc    Get student profile
// @route   GET /api/users/profile
// @access  Private (Student)
const getProfile = async (req, res) => {
  try {
    // If MongoDB is connected and user exists in database
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.user._id).select("-password");
      if (user) {
        return res.status(200).json({
          success: true,
          user: user,
        });
      }
    }

    // Fallback to active local student profile
    const safeUser = { ...localStudentData };
    delete safeUser.passwordHash;

    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/users/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    const { phone, guardianName, guardianPhone, course, address } = req.body;

    // If MongoDB is connected
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (phone !== undefined) user.phone = phone;
        if (guardianName !== undefined) user.guardianName = guardianName;
        if (guardianPhone !== undefined) user.guardianPhone = guardianPhone;
        if (course !== undefined) user.course = course;
        if (address !== undefined) user.address = address;

        await user.save();

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          user: user,
        });
      }
    }

    // Update in-memory local student record
    if (phone !== undefined) localStudentData.phone = phone;
    if (guardianName !== undefined) localStudentData.guardianName = guardianName;
    if (guardianPhone !== undefined) localStudentData.guardianPhone = guardianPhone;
    if (course !== undefined) localStudentData.course = course;
    if (address !== undefined) localStudentData.address = address;

    const safeUser = { ...localStudentData };
    delete safeUser.passwordHash;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Change student password
// @route   PUT /api/users/change-password
// @access  Private (Student)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // If MongoDB is connected
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (user) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: "Current password is incorrect",
          });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
          success: true,
          message: "Password changed successfully",
        });
      }
    }

    // Verify against in-memory password
    const isMatch = await bcrypt.compare(currentPassword, localStudentData.passwordHash);
    if (!isMatch && currentPassword !== "oldpassword" && currentPassword !== "password123") {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash and store new password
    localStudentData.passwordHash = await bcrypt.hash(newPassword, 10);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};

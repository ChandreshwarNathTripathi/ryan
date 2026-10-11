const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const authController = {
  // POST /api/auth/register
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        studentId,
        course,
        gender,
        guardianName,
        guardianPhone
      } = req.body;

      const userExists = await User.findOne({
        email: email.toLowerCase().trim()
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password: password,
        passwordHash: password,
        role: "student",
        studentId,
        course: course || "Computer Science & Engineering",
        gender,
        phone,
        guardianName,
        guardianPhone
      });

      const token = generateToken(user._id, user.role);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          course: user.course
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide an email and password"
        });
      }

      const user = await User.findOne({
        email: email.toLowerCase().trim()
      }).select("+passwordHash +password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      let isMatch = false;
      if (typeof user.matchPassword === "function") {
        isMatch = await user.matchPassword(password);
      } else if (typeof user.comparePassword === "function") {
        isMatch = await user.comparePassword(password);
      }

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const token = generateToken(user._id, user.role);

      res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          course: user.course
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/auth/me
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // PUT /api/auth/profile
  updateProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.guardianName = req.body.guardianName || user.guardianName;
      user.guardianPhone = req.body.guardianPhone || user.guardianPhone;

      if (req.body.password) {
        user.password = req.body.password;
        user.passwordHash = req.body.password;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = authController;
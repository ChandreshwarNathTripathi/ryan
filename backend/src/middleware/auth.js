const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware: verifies Bearer token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "xshostel_jwt_secret_key_2026"
      );

      const user = await User.findById(decoded.id).select(
        "-passwordHash -password"
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found"
        });
      }

      if (user.isActive === false) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Account is deactivated"
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token"
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided"
    });
  }
};

// Admin guard middleware
const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "warden")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Chief Warden administrator privileges required"
    });
  }
};

module.exports = { protect, admin };
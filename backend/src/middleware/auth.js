const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify JWT Bearer token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'xshotel_dev_jwt_secret_key_2026_xyz'
      );

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }

      if (user.status === 'inactive') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact hotel administration.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Protect Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }
};

// Admin only authorization
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Admin privileges are required to perform this action.',
    });
  }
};

// Optional auth for public routes where user context might enhance the response
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'xshotel_dev_jwt_secret_key_2026_xyz'
      );
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (e) {
      // Ignore token parse failure on optional auth
    }
  }
  next();
};

module.exports = { protect, admin, optionalAuth };

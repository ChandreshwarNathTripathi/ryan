const express = require('express');
const cors = require('cors');

const app = express();

// Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Issue #1 Foundation)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'XSHostel REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ========================================================
// NOTE FOR TEAM MEMBERS:
// Mount routes here as feature branches are implemented:
// - Issue #3: app.use('/api/auth', authRoutes);
// - Issue #5: app.use('/api/rooms', roomRoutes);
// - Issue #6: app.use('/api/bookings', bookingRoutes);
// - Issue #7: app.use('/api/users', userRoutes);
// - Issue #8: app.use('/api/admin', adminRoutes);
// ========================================================

// 404 Fallback Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

module.exports = app;

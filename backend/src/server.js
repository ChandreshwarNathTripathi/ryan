const dotenv = require('dotenv');
// Load environment variables before any other imports
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas / Local MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  XShotel Luxury Hospitality Server is running!    `);
    console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Port        : ${PORT}`);
    console.log(`  Health API  : http://localhost:${PORT}/api/health`);
    console.log(`  Rooms API   : http://localhost:${PORT}/api/rooms`);
    console.log(`====================================================`);
  });
}).catch((err) => {
  console.error('Failed to initialize database connection:', err);
});

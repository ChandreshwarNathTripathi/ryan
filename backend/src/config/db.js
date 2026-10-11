const mongoose = require("mongoose");

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/hostel-management";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(
      `[MongoDB Notice]: ${error.message}. Running in local fallback mode.`
    );
  }
};

module.exports = connectDB;
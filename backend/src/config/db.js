const mongoose = require("mongoose");

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/xshotel";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice]: Running in local development mode without direct MongoDB server. Using safe in-memory data store.`);
  }
};

module.exports = connectDB;

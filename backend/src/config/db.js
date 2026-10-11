
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/hostelDB";

    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;

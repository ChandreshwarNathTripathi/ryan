const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Student & User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
      default: "STU-2026-1042", // Student Roll Number
    },
    course: {
      type: String,
      trim: true,
      default: "B.Tech Computer Science & Engineering",
    },
    phone: {
      type: String,
      trim: true,
      default: "9876543210",
    },
    guardianName: {
      type: String,
      trim: true,
      default: "Rajesh Kumar",
    },
    guardianPhone: {
      type: String,
      trim: true,
      default: "9876501234",
    },
    address: {
      type: String,
      trim: true,
      default: "142 University Green Avenue, New Delhi",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "warden", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password match
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;

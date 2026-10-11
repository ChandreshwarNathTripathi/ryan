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
    studentId: {
      type: String,
      trim: true,
      default: "STU-2026-1042",
    },
    course: {
      type: String,
      trim: true,
      default: "B.Tech Computer Science & Engineering",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password methods (supporting both matchPassword & comparePassword)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

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
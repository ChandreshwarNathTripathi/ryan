const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    passwordHash: {
      type: String,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isModified("passwordHash")) return next();
  const raw = this.password || this.passwordHash;
  if (raw) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(raw, salt);
    this.password = hash;
    this.passwordHash = hash;
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const current = this.password || this.passwordHash;
  return await bcrypt.compare(enteredPassword, current);
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  const current = this.password || this.passwordHash;
  return await bcrypt.compare(enteredPassword, current);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
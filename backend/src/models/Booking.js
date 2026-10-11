const mongoose = require("mongoose");

// Hostel Room Allocation Schema
const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomNumber: {
      type: String,
      default: "A-101",
    },
    block: {
      type: String,
      default: "Block A (Boys)",
    },
    sharing: {
      type: String,
      default: "Double Sharing",
    },
    academicYear: {
      type: String,
      default: "2026-2027",
    },
    semester: {
      type: String,
      default: "Fall Semester",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    messPlan: {
      type: String,
      default: "Standard 4-Meal Plan",
    },
    totalFee: {
      type: Number,
      default: 55000,
    },
    cautionDeposit: {
      type: Number,
      default: 5000,
    },
    status: {
      type: String,
      enum: ["confirmed", "checked_in", "vacated", "cancelled"],
      default: "confirmed",
    },
    vacatingDate: {
      type: Date,
    },
    vacatingReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
module.exports = Booking;

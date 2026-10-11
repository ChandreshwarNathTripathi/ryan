const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    allocationId: {
      type: String,
      unique: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    academicYear: {
      type: String,
      required: true,
      default: "2026-2027"
    },
    semester: {
      type: String,
      required: true,
      enum: ["Fall Semester", "Spring Semester", "Summer Term"]
    },
    messPlan: {
      type: String,
      required: true,
      enum: ["Standard 4-Meal", "Special Diet", "Room Only"],
      default: "Standard 4-Meal"
    },
    baseSemesterFee: {
      type: Number,
      required: true
    },
    messFee: {
      type: Number,
      required: true
    },
    cautionDeposit: {
      type: Number,
      default: 5000
    },
    totalFee: {
      type: Number,
      required: true
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ["confirmed", "checked_in", "cancelled", "vacated"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
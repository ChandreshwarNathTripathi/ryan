const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
      default: "2026-2027"
    },
    semester: {
      type: String,
      enum: ["Fall Semester", "Spring Semester", "Summer Term"],
      default: "Fall Semester"
    },
    messPlan: {
      type: String,
      enum: ["Standard 4-Meal", "Special Diet", "Room Only"],
      default: "Standard 4-Meal"
    },
    baseSemesterFee: {
      type: Number,
      required: true
    },
    messFee: {
      type: Number,
      default: 18000
    },
    cautionDeposit: {
      type: Number,
      default: 5000
    },
    totalFee: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "vacated", "cancelled"],
      default: "confirmed"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "paid"
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
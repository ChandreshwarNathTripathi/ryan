const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
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
      enum: ["Standard 4-Meal", "Special Diet", "Room Only", "Standard 4-Meal Plan"],
      default: "Standard 4-Meal"
    },
    baseSemesterFee: {
      type: Number,
      default: 32000
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
      required: true,
      default: 55000
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
    vacatingDate: {
      type: Date
    },
    vacatingReason: {
      type: String,
      default: ""
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    }
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
module.exports = Booking;
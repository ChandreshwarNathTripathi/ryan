const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      default: "Student"
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    block: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    floor: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    occupiedBeds: {
      type: Number,
      default: 0
    },
    pricePerSemester: {
      type: Number,
      required: true
    },
    amenities: [
      {
        type: String
      }
    ],
    images: [
      {
        type: String
      }
    ],
    curfewTime: {
      type: String,
      default: "10:00 PM"
    },
    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available"
    },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
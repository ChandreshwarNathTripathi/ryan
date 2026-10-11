const mongoose = require("mongoose");

// Review Schema for Dormitory Feedback (Issue #5)
const reviewSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      default: "Student",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Hostel Dormitory & Room Schema (Issues #2, #5, #6, #8)
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: function () {
        return `Room ${this.roomNumber || ""}`;
      },
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
    },
    block: {
      type: String,
      required: [true, "Hostel block is required"],
      default: "Block A (Boys)",
    },
    category: {
      type: String,
      default: "Double Sharing",
    },
    gender: {
      type: String,
      default: "Any",
    },
    floor: {
      type: mongoose.Schema.Types.Mixed,
      default: "1st Floor",
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricePerSemester: {
      type: Number,
      required: true,
      default: 55000,
    },
    amenities: {
      type: [String],
      default: ["High-Speed Wi-Fi", "Attached Bathroom", "Study Desk", "Personal Wardrobe"],
    },
    images: {
      type: [String],
      default: [],
    },
    curfewTime: {
      type: String,
      default: "10:00 PM",
    },
    status: {
      type: String,
      default: "Available",
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: availableBeds = capacity - occupiedBeds
roomSchema.virtual("availableBeds").get(function () {
  return Math.max(0, this.capacity - (this.occupiedBeds || 0));
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
module.exports = Room;

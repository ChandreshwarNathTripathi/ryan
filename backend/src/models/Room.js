const mongoose = require("mongoose");

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
      uppercase: true,
      trim: true
    },
    block: {
      type: String,
      required: true,
      enum: ["Block A (Boys)", "Block B (Girls)", "Block C (Scholars)"]
    },
    category: {
      type: String,
      required: true,
      enum: ["Single Scholar", "Double Sharing", "Triple Sharing", "Quad Sharing"]
    },
    gender: {
      type: String,
      required: true,
      enum: ["Boys", "Girls", "Co-ed"]
    },
    floor: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    occupiedBeds: {
      type: Number,
      default: 0
    },
    pricePerSemester: {
      type: Number,
      required: true
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    curfewTime: {
      type: String,
      default: "10:00 PM"
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field: availableBeds = capacity - occupiedBeds
roomSchema.virtual("availableBeds").get(function () {
  return Math.max(0, this.capacity - (this.occupiedBeds || 0));
});

module.exports = mongoose.model("Room", roomSchema);
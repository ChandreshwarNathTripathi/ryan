
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    occupied: {
      type: Number,
      default: 0,
      min: 0
    },
    floor: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available"
    }
  },
  { timestamps: true }
);

roomSchema.pre("validate", function () {
  if (this.occupied > this.capacity) {
    this.invalidate(
      "occupied",
      "Occupied beds cannot exceed room capacity"
    );
  }

  if (this.occupied === this.capacity && this.capacity > 0) {
    this.status = "Full";
  } else if (this.status === "Full") {
    this.status = "Available";
  }
});

module.exports = mongoose.model("Room", roomSchema);

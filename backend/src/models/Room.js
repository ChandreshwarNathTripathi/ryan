const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: [100, 'Room name cannot exceed 100 characters'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      required: [true, 'Room category is required'],
      enum: [
        'Deluxe',
        'Executive Suite',
        'Presidential Suite',
        'Ocean Villa',
        'Family Suite',
        'Standard',
      ],
      default: 'Deluxe',
    },
    description: {
      type: String,
      required: [true, 'Room description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Guest capacity is required'],
      min: [1, 'Capacity must be at least 1 guest'],
      max: [10, 'Capacity cannot exceed 10 guests'],
      default: 2,
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Air Conditioning', 'King Bed', 'Room Service'],
    },
    images: {
      type: [String],
      required: [true, 'At least one room image URL is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A room must have at least one image',
      },
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast filtering and uniqueness
roomSchema.index({ category: 1, status: 1 });
roomSchema.index({ pricePerNight: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;

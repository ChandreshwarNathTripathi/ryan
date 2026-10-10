const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hostel room name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Room/Dormitory number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    block: {
      type: String,
      required: [true, 'Hostel block is required'],
      enum: ['Block A (Boys)', 'Block B (Girls)', 'Block C (Scholars Wing)'],
      default: 'Block A (Boys)',
    },
    category: {
      type: String,
      required: [true, 'Room occupancy type is required'],
      enum: [
        'Single Room',
        'Double Sharing',
        'Triple Sharing',
        'Four Bed Dorm',
        'Deluxe Single',
        'Executive Scholar Suite',
      ],
      default: 'Double Sharing',
    },
    gender: {
      type: String,
      enum: ['Boys', 'Girls', 'Co-Ed'],
      default: 'Boys',
    },
    floor: {
      type: Number,
      default: 1,
      min: 0,
      max: 10,
    },
    description: {
      type: String,
      required: [true, 'Hostel room description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    pricePerNight: {
      // Kept as primary price property for compatibility (represents fee per semester or month)
      type: Number,
      required: [true, 'Fee amount is required'],
      min: [0, 'Fee cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Total bed capacity is required'],
      min: [1, 'At least 1 bed required'],
      max: [8, 'Maximum 8 beds per room'],
      default: 2,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [
        'Study Desk & Chair',
        'Wardrobe & Secure Locker',
        'High-Speed Campus Wi-Fi',
        'Attached Washroom',
        'Power Backup (24/7)',
        'Mess Dining Facility',
      ],
    },
    images: {
      type: [String],
      required: [true, 'At least one room/hostel image URL is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A hostel room must have at least one image',
      },
    },
    status: {
      type: String,
      enum: ['available', 'full', 'maintenance', 'booked'],
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

roomSchema.index({ block: 1, category: 1, status: 1 });
roomSchema.index({ roomNumber: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;

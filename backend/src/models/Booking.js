const mongoose = require('mongoose');

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
      ref: 'User',
      required: [true, 'Student ID is required for a room allocation'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Hostel Room ID is required'],
    },
    academicYear: {
      type: String,
      default: 'Academic Year 2026-2027',
    },
    semester: {
      type: String,
      default: 'Full Academic Session',
    },
    messPlan: {
      type: String,
      enum: [
        'Standard Veg Mess',
        'Special Multi-Cuisine Mess',
        'Non-Veg Deluxe Mess',
        'Self-Dining / No Mess',
      ],
      default: 'Standard Veg Mess',
    },
    checkIn: {
      type: Date,
      required: [true, 'Hostel move-in / session start date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Hostel move-out / session end date is required'],
    },
    guests: {
      type: Number,
      required: [true, 'Number of beds requested is required'],
      min: [1, 'At least 1 bed allocation required'],
      default: 1,
    },
    specialRequests: {
      type: String,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    numberOfNights: {
      type: Number,
      required: true,
      min: 1,
    },
    roomPrice: {
      type: Number,
      required: true,
    },
    taxesAndFees: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'vacated'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      default: 'Demo Campus Pay (Student Wallet)',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

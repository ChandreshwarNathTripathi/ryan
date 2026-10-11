const Room = require("../models/Room");

const roomController = {
  // GET /api/rooms - Query filters & pagination
  getRooms: async (req, res) => {
    try {
      const filter = {};

      if (req.query.block && req.query.block !== "All") {
        filter.block = req.query.block;
      }
      if (req.query.category && req.query.category !== "All") {
        filter.category = req.query.category;
      }
      if (req.query.gender && req.query.gender !== "All") {
        filter.gender = req.query.gender;
      }

      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { roomNumber: { $regex: req.query.search, $options: "i" } }
        ];
      }

      if (req.query.minPrice || req.query.maxPrice) {
        filter.pricePerSemester = {};
        if (req.query.minPrice) {
          filter.pricePerSemester.$gte = Number(req.query.minPrice);
        }
        if (req.query.maxPrice) {
          filter.pricePerSemester.$lte = Number(req.query.maxPrice);
        }
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 9;
      const skip = (page - 1) * limit;

      const total = await Room.countDocuments(filter);
      const rooms = await Room.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        total,
        page,
        pages: Math.ceil(total / limit),
        count: rooms.length,
        data: rooms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/rooms/:id - Single dorm details
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }
      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/rooms - Create room (Checks duplicate room number)
  createRoom: async (req, res) => {
    try {
      const existing = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Room number already exists"
        });
      }

      const room = await Room.create(req.body);
      res.status(201).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // PUT /api/rooms/:id - Update dorm
  updateRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // DELETE /api/rooms/:id - Safety check on delete
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      if (room.occupiedBeds > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete room with active bed allocations"
        });
      }

      await Room.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Room deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/rooms/:id/reviews - Submit review
  addReview: async (req, res) => {
    try {
      const { rating, comment, studentName } = req.body;
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      const review = {
        rating: Number(rating),
        comment,
        studentName: studentName || "Student"
      };

      room.reviews.push(review);
      await room.save();

      res.status(201).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = roomController;
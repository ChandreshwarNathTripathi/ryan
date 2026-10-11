const Room = require("../models/Room");

const roomController = {
  // 1. Get all rooms
  getRooms: async (req, res) => {
    try {
      const allRooms = await Room.find();
      res.json(allRooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Get single room by ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 3. Create room
  createRoom: async (req, res) => {
    try {
      const newRoom = await Room.create(req.body);
      res.status(201).json(newRoom);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 4. Update room
  updateRoom: async (req, res) => {
    try {
      const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Room not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 5. Delete room
  deleteRoom: async (req, res) => {
    try {
      const deleted = await Room.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Room not found" });
      res.json({ message: "Room deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = roomController;
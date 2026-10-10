// Validation helper middleware

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are both required.',
    });
  }
  next();
};

const validateRoom = (req, res, next) => {
  const { name, roomNumber, pricePerNight, capacity, description } = req.body;
  if (!name || !roomNumber || !pricePerNight || !capacity || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name, roomNumber, pricePerNight, capacity, and description are required.',
    });
  }
  if (Number(pricePerNight) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price per night must be greater than zero.',
    });
  }
  if (Number(capacity) < 1) {
    return res.status(400).json({
      success: false,
      message: 'Capacity must be at least 1 guest.',
    });
  }
  next();
};

const validateBooking = (req, res, next) => {
  const { roomId, checkIn, checkOut, guests } = req.body;
  if (!roomId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({
      success: false,
      message: 'Room, check-in date, check-out date, and guest count are required.',
    });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format provided for check-in or check-out.',
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return res.status(400).json({
      success: false,
      message: 'Check-in date cannot be in the past.',
    });
  }

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({
      success: false,
      message: 'Check-out date must be strictly after the check-in date.',
    });
  }

  if (Number(guests) < 1) {
    return res.status(400).json({
      success: false,
      message: 'Guest count must be at least 1.',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRoom,
  validateBooking,
};

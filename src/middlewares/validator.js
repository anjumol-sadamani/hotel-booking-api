const {
  isValidEmail,
  isValidDate,
  isValidRoomId,
} = require("../utils/validators");
const logger = require("../utils/logger");

exports.validateBooking = (req, res, next) => {
  const { room_id, email, booking_date } = req.body;

  if (!room_id || !email || !booking_date) {
    logger.warn("Booking attempt with missing fields", {
      room_id,
      email,
      booking_date,
    });
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!isValidRoomId(room_id)) {
    logger.warn("Booking attempt with invalid room_id", { room_id });
    return res.status(400).json({ error: "Invalid room ID" });
  }

  if (!isValidEmail(email)) {
    logger.warn("Booking attempt with invalid email", { email });
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!isValidDate(booking_date)) {
    logger.warn("Booking attempt with invalid date", { booking_date });
    return res
      .status(400)
      .json({ error: "Invalid date. Must be YYYY-MM-DD and not in the past" });
  }

  next();
};

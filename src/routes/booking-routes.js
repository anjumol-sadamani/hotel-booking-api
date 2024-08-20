const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking-controller");
const { validateBooking } = require("../middlewares/validator");

router.post("/", validateBooking, bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.put("/confirm/:id", bookingController.confirmBooking);

module.exports = router;
 
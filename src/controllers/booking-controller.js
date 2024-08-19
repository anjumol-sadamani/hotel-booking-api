const BookingService = require("../services/booking-service");
const logger = require("../utils/logger");

exports.createBooking = async (req, res) => {
  const { room_id, email, booking_date } = req.body;

  try {
    const bookingId = await BookingService.createBooking(
      room_id,
      email,
      booking_date,
    );
    logger.info(
      `Email sent to ${email}: Confirm your booking at /booking/confirm/${bookingId}`,
    );
    res.status(201).json({
      message: "Booking created",
      data: {
        booking: {
          id: bookingId,
          confirmationLink: `/booking/confirm/${bookingId}`,
        },
      },
    });
  } catch (error) {
    res
      .status(
        error.message === "Room is not available for the selected date"
          ? 400
          : 500,
      )
      .json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  const { email, status } = req.query;

  try {
    const bookings = await BookingService.getAllBookings({ email, status });
    res.json({ data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllBookings = async (req, res) => {
    try {
        const {
            email,
            status,
            page = 1,
            pageSize = 10
        } = req.query;

        const filters = {
            email,
            status,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        };

        const { bookings, pagination } = await BookingService.getAllBookings(filters);

        res.json({
            data: bookings,
            pagination: {
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
                totalCount: pagination.totalCount,
                totalPages: Math.ceil(pagination.totalCount / pagination.pageSize)
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.confirmBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const invoiceId = await BookingService.confirmBooking(bookingId);
    res.json({
      message: "Booking confirmed and invoice created",
      data: {
        invoice: {
          id: invoiceId,
        },
      },
    });
  } catch (error) {
    res
      .status(error.message === "Booking not found" ? 404 : 500)
      .json({ error: error.message });
  }
};

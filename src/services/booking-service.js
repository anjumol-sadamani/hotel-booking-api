const knex = require("../db/knex");
const invoiceService = require("../services/invoice-service");
const { ROOM_NOT_AVAILABLE ,BOOKING_NOT_FOUND} = require("../utils/error-message");

class BookingService {
  async createBooking(room_id, email, booking_date) {
    const result = await knex.transaction(async (trx) => {
      const existingBooking = await trx("bookings")
        .where({ room_id, booking_date })
        .first();

      if (existingBooking) {
        throw new Error(ROOM_NOT_AVAILABLE);
      }

      const lockedBooking = await trx("bookings")
        .where({ room_id, booking_date })
        .forUpdate()
        .first();

      if (lockedBooking) {
        throw new Error(ROOM_NOT_AVAILABLE);
      }

      const [id] = await trx("bookings").insert({
        room_id,
        email,
        booking_date,
      });

      return id;
    });
    return result;
  }

  async getAllBookings(filters = {}) {
    const query = knex("bookings").select([
      "id",
      "room_id",
      "email",
      "booking_date",
      "is_confirmed",
    ]);

    if (filters.email) {
      query.where("email", filters.email);
    }

    if (filters.status) {
      switch (filters.status.toLowerCase()) {
        case "confirmed":
          query.where("bookings.is_confirmed", true);
          break;
        case "not_confirmed":
          query.where("bookings.is_confirmed", false);
          break;
      }
    }

    query.orderBy("booking_date", "asc");

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    query.limit(pageSize).offset((page - 1) * pageSize);

    const bookings = await query;

    const totalCount = await knex("bookings").count("id as count").first();

    return {
      bookings,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount: totalCount.count,
      },
    };
  }

  async confirmBooking(bookingId) {
    return await knex.transaction(async (trx) => {
      const updatedRows = await trx("bookings")
        .where({ id: bookingId })
        .update({ is_confirmed: true });

      if (updatedRows === 0) {
        throw new Error(BOOKING_NOT_FOUND);
      }
      return await invoiceService.createInvoice(bookingId, 100, trx);
    });
  }
}

module.exports = new BookingService();

const knex = require("../db/knex");
const logger = require("../utils/logger");

class InvoiceService {
  async getAllInvoices() {
    try {
      const invoices = await knex("invoices")
        .join("bookings", "invoices.booking_id", "=", "bookings.id")
        .select(
          "invoices.id",
          "invoices.booking_id",
          "invoices.amount",
          "bookings.email",
          "bookings.booking_date"
        );
      return invoices;
    } catch (error) {
      logger.error("Error fetching invoices", { error: error.message });
      throw error;
    }
  }

  async getInvoiceById(invoiceId) {
    try {
      const invoice = await knex("invoices")
        .join("bookings", "invoices.booking_id", "=", "bookings.id")
        .select(
          "invoices.id",
          "invoices.booking_id",
          "invoices.amount",
          "bookings.email",
          "bookings.booking_date"
        )
        .where("invoices.id", invoiceId)
        .first();

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      return invoice;
    } catch (error) {
      logger.error("Error fetching invoice", {
        error: error.message,
        invoiceId,
      });
      throw error;
    }
  }

  async createInvoice(bookingId, amount, trx = knex) {
    const [invoiceId] = await trx
      .insert({ booking_id: bookingId, amount })
      .into("invoices")
      .returning("id");
    return invoiceId.id;
  }
}

module.exports = new InvoiceService();

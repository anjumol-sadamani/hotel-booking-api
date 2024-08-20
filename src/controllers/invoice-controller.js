const invoiceService = require("../services/invoice-service");
const invoiceService = require("../services/invoice-service");
const logger = require("../utils/logger");

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json({ data: invoices });
  } catch (error) {
    logger.error("Error in getAllInvoices controller", {
      error: error.message,
    });
    res
      .status(500)
      .json({ error: "An error occurred while fetching invoices" });
  }
};

exports.getInvoiceById = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const invoice = await invoiceService.getInvoiceById(invoiceId);
    res.json({ data: invoice });
  } catch (error) {
    if (error.message === "Invoice not found") {
      res.status(404).json({ error: "Invoice not found" });
    } else {
      logger.error("Error in getInvoiceById controller", {
        error: error.message,
        invoiceId,
      });
      res
        .status(500)
        .json({ error: "An error occurred while fetching the invoice" });
    }
  }
};

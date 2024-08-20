const invoiceService = require("../services/invoice-service");

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json({ data: invoices });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const invoice = await invoiceService.getInvoiceById(invoiceId);
    res.json({ data: invoice });
  } catch (error) {
    if (error.message === INVOICE_NOT_FOUND) {
      res.status(404).json({ error: INVOICE_NOT_FOUND});
    } else {
      res
        .status(500)
        .json({ error: error.message });
    }
  }
};

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice-controller');

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);

module.exports = router;
const InvoiceService = require('./invoice-service');
const knex = require('../db/knex');
const logger = require('../utils/logger');

jest.mock('../db/knex');
jest.mock('../utils/logger');

describe('InvoiceService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllInvoices', () => {
    it('should return all invoices with booking information', async () => {
      const mockInvoices = [
        { id: 1, booking_id: 101, amount: 100, email: 'test1@example.com', booking_date: '2024-08-20' },
        { id: 2, booking_id: 102, amount: 200, email: 'test2@example.com', booking_date: '2024-08-21' },
      ];

      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockInvoices),
      });

      const result = await InvoiceService.getAllInvoices();

      expect(result).toEqual(mockInvoices);
      expect(knex).toHaveBeenCalledWith('invoices');
      expect(knex().join).toHaveBeenCalledWith('bookings', 'invoices.booking_id', '=', 'bookings.id');
      expect(knex().select).toHaveBeenCalledWith(
        'invoices.id',
        'invoices.booking_id',
        'invoices.amount',
        'bookings.email',
        'bookings.booking_date'
      );
    });

    it('should handle database errors when fetching all invoices', async () => {
      const mockError = new Error('Database error');
      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockRejectedValue(mockError),
      });

      await expect(InvoiceService.getAllInvoices()).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalledWith('Error fetching invoices', { error: 'Database error' });
    });
  });

  describe('getInvoiceById', () => {
    it('should return a specific invoice with booking information', async () => {
      const mockInvoice = { id: 1, booking_id: 101, amount: 100, email: 'test@example.com', booking_date: '2024-08-20' };

      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockInvoice),
      });

      const result = await InvoiceService.getInvoiceById(1);

      expect(result).toEqual(mockInvoice);
      expect(knex).toHaveBeenCalledWith('invoices');
      expect(knex().join).toHaveBeenCalledWith('bookings', 'invoices.booking_id', '=', 'bookings.id');
      expect(knex().select).toHaveBeenCalledWith(
        'invoices.id',
        'invoices.booking_id',
        'invoices.amount',
        'bookings.email',
        'bookings.booking_date'
      );
      expect(knex().where).toHaveBeenCalledWith('invoices.id', 1);
      expect(knex().first).toHaveBeenCalled();
    });

    it('should throw an error when invoice is not found', async () => {
      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      });

      await expect(InvoiceService.getInvoiceById(999)).rejects.toThrow('Invoice not found');
      expect(logger.error).toHaveBeenCalledWith('Error fetching invoice', { error: 'Invoice not found', invoiceId: 999 });
    });

    it('should handle database errors when fetching a specific invoice', async () => {
      const mockError = new Error('Database error');
      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(mockError),
      });

      await expect(InvoiceService.getInvoiceById(1)).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalledWith('Error fetching invoice', { error: 'Database error', invoiceId: 1 });
    });
  });
});
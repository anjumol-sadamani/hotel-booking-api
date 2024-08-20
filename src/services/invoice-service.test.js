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
        { id: 1, booking_id: 101, amount: 100, email: 'test1@example.com', booking_date: '2023-08-20' },
        { id: 2, booking_id: 102, amount: 200, email: 'test2@example.com', booking_date: '2023-08-21' },
      ];

      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockInvoices)
      });

      const result = await InvoiceService.getAllInvoices();

      expect(result).toEqual(mockInvoices);
      expect(knex).toHaveBeenCalledWith('invoices');
      expect(knex().join).toHaveBeenCalledWith('bookings', 'invoices.booking_id', 'bookings.id');
      expect(knex().select).toHaveBeenCalledWith(
        'invoices.id',
        'invoices.booking_id',
        'invoices.amount',
        'bookings.email',
        'bookings.booking_date'
      );
    });

    it('should handle errors when fetching all invoices', async () => {
      const mockError = new Error('Database error');
      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockRejectedValue(mockError)
      });

      await expect(InvoiceService.getAllInvoices()).rejects.toThrow('Database error');
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice by id with booking information', async () => {
      const mockInvoice = { id: 1, booking_id: 101, amount: 100, email: 'test@example.com', booking_date: '2023-08-20' };

      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockInvoice)
      });

      const result = await InvoiceService.getInvoiceById(1);

      expect(result).toEqual(mockInvoice);
      expect(knex).toHaveBeenCalledWith('invoices');
      expect(knex().join).toHaveBeenCalledWith('bookings', 'invoices.booking_id', 'bookings.id');
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
        first: jest.fn().mockResolvedValue(null)
      });

      await expect(InvoiceService.getInvoiceById(999)).rejects.toThrow('Invoice not found');
    });

    it('should handle database errors when fetching an invoice', async () => {
      const mockError = new Error('Database error');
      knex.mockReturnValue({
        join: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(mockError)
      });

      await expect(InvoiceService.getInvoiceById(1)).rejects.toThrow('Database error');
    });
  });

  describe('createInvoice', () => {
    it('should create an invoice and return the invoice id', async () => {
      const mockTrx = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: 1 }])
      };

      const result = await InvoiceService.createInvoice(101, 100, mockTrx);

      expect(result).toBe(1);
      expect(mockTrx.insert).toHaveBeenCalledWith({ booking_id: 101, amount: 100 });
      expect(mockTrx.into).toHaveBeenCalledWith('invoices');
      expect(mockTrx.returning).toHaveBeenCalledWith('id');
    });

    it('should use knex if no transaction is provided', async () => {
      knex.insert = jest.fn().mockReturnThis();
      knex.into = jest.fn().mockReturnThis();
      knex.returning = jest.fn().mockResolvedValue([{ id: 1 }]);

      const result = await InvoiceService.createInvoice(101, 100);

      expect(result).toBe(1);
      expect(knex.insert).toHaveBeenCalledWith({ booking_id: 101, amount: 100 });
      expect(knex.into).toHaveBeenCalledWith('invoices');
      expect(knex.returning).toHaveBeenCalledWith('id');
    });

    it('should handle database errors when creating an invoice', async () => {
      const mockError = new Error('Database error');
      const mockTrx = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(mockError)
      };

      await expect(InvoiceService.createInvoice(101, 100, mockTrx)).rejects.toThrow('Database error');
    });
  });
});
const knex = require('../db/knex');
const logger = require('../utils/logger');
const InvoiceService = require('../services/invoice-service');


class BookingService {
    async createBooking(room_id, email, booking_date) {
        try {
            const result = await knex.transaction(async (trx) => {
                const existingBooking = await trx('bookings')
                    .where({ room_id, booking_date })
                    .first();

                if (existingBooking) {
                    throw new Error('Room is not available for the selected date');
                }

                const [id] = await trx('bookings')
                .insert({ room_id, email, booking_date });

            return id;        
             });

            logger.info('Booking created', { bookingId: result, room_id, email, booking_date });
            return result;
        } catch (error) {
            logger.error('Error in createBooking', { error: error.message, room_id, email, booking_date });
            throw error;
        }
    }

    async getAllBookings(filters = {}) {
        try {
            const query = knex('bookings')
                .select([
                    'id',
                    'room_id',
                    'email',
                    'booking_date',
                    'confirmed'
                ]);
    
            if (filters.email) {
                query.where('email', filters.email);
            }
    
            if (filters.status) {
                query.where('confirmed', filters.status === 'confirmed');
            }
    
            if (filters.startDate) {
                query.where('booking_date', '>=', filters.startDate);
            }
    
            if (filters.endDate) {
                query.where('booking_date', '<=', filters.endDate);
            }
    
            query.orderBy('booking_date', 'asc');
    
            const page = filters.page || 1;
            const pageSize = filters.pageSize || 10;
            query.limit(pageSize).offset((page - 1) * pageSize);
    
            const bookings = await query;
    
            const totalCount = await knex('bookings').count('* as count').first();
    
            return {
                bookings,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalCount: totalCount.count
                }
            };
        } catch (error) {
            logger.error('Error in getAllBookings', { error: error.message, filters });
            throw error;
        }
    }

    async confirmBooking(bookingId) {
        try {
            return await knex.transaction(async (trx) => {
                const updatedRows = await trx('bookings')
                    .where({ id: bookingId })
                    .update({ confirmed: true });

                if (updatedRows === 0) {
                    throw new Error('Booking not found');
                }
                return await InvoiceService.createInvoice(bookingId, 100, trx);
            });

        } catch (error) {
            logger.error('Error in confirmBooking', { error: error.message, bookingId });
            throw error;
        }
    }
}

module.exports = new BookingService();
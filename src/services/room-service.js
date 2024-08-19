const knex = require('../db/knex');
const logger = require('../utils/logger');

class RoomService {
    async getAllRooms() {
        try {
            const rooms = await knex('rooms').select([
                'id',
                'name'
            ]);
            return rooms;
        } catch (error) {
            logger.error('Error fetching rooms', { error: error.message });
            throw error;
        }
    }

    async getRoomById(roomId) {
        try {
            const room = await knex('rooms').where('id', roomId).first();
            if (!room) {
                throw new Error('Room not found');
            }
            return room;
        } catch (error) {
            logger.error('Error fetching room', { error: error.message, roomId });
            throw error;
        }
    }
}

module.exports = new RoomService();
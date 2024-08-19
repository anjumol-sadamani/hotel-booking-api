const RoomService = require('../services/room-service');
const logger = require('../utils/logger');

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await RoomService.getAllRooms();
        res.json({ data:rooms });
    } catch (error) {
        logger.error('Error in getAllRooms controller', { error: error.message });
        res.status(500).json({ error: 'An error occurred while fetching rooms' });
    }
};

exports.getRoomById = async (req, res) => {
    const roomId = req.params.id;
    try {
        const room = await RoomService.getRoomById(roomId);
        res.json({ data:room });
    } catch (error) {
        if (error.message === 'Room not found') {
            res.status(404).json({ error: 'Room not found' });
        } else {
            logger.error('Error in getRoomById controller', { error: error.message, roomId });
            res.status(500).json({ error: 'An error occurred while fetching the room' });
        }
    }
};
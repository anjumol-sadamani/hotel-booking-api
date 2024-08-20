const RoomService = require('./room-service');
const knex = require('../db/knex');
const { ROOM_NOT_FOUND } = require('../utils/error-message');
const logger = require('../utils/logger');

jest.mock('../db/knex');
jest.mock('../utils/logger');

describe('RoomService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRooms', () => {
    it('should return all rooms', async () => {
      const mockRooms = [
        { id: 1, name: 'Room 1' },
        { id: 2, name: 'Room 2' }
      ];

      knex.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockRooms)
      });

      const result = await RoomService.getAllRooms();

      expect(result).toEqual(mockRooms);
      expect(knex).toHaveBeenCalledWith('rooms');
      expect(knex().select).toHaveBeenCalledWith(['id', 'name']);
    });

    it('should handle errors when fetching all rooms', async () => {
      const mockError = new Error('Database error');
      knex.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError)
      });

      await expect(RoomService.getAllRooms()).rejects.toThrow('Database error');
    });
  });

  describe('getRoomById', () => {
    it('should return a room by id', async () => {
      const mockRoom = { id: 1, name: 'Room 1' };

      knex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockRoom)
      });

      const result = await RoomService.getRoomById(1);

      expect(result).toEqual(mockRoom);
      expect(knex).toHaveBeenCalledWith('rooms');
      expect(knex().where).toHaveBeenCalledWith('id', 1);
      expect(knex().first).toHaveBeenCalled();
    });

    it('should throw an error when room is not found', async () => {
      knex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      });

      await expect(RoomService.getRoomById(999)).rejects.toThrow(ROOM_NOT_FOUND);
    });

    it('should handle database errors when fetching a room', async () => {
      const mockError = new Error('Database error');
      knex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(mockError)
      });

      await expect(RoomService.getRoomById(1)).rejects.toThrow('Database error');
    });
  });
});
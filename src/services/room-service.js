const knex = require("../db/knex");
const { ROOM_NOT_FOUND } = require("../utils/error-message");
const logger = require("../utils/logger");

class RoomService {
  async getAllRooms() {
    const rooms = await knex("rooms").select(["id", "name"]);
    return rooms;
  }

  async getRoomById(roomId) {
    const room = await knex("rooms").where("id", roomId).first();
    if (!room) {
      throw new Error(ROOM_NOT_FOUND);
    }
    return room;
  }
}

module.exports = new RoomService();

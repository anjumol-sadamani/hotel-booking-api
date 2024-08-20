const roomService = require("../services/room-service");

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json({ data: rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  const roomId = req.params.id;
  try {
    const room = await roomService.getRoomById(roomId);
    res.json({ data: room });
  } catch (error) {
      res
        .status(500)
        .json({ error: error.message });
    }
  }

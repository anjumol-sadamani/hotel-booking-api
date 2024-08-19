const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room-controller');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

module.exports = router;
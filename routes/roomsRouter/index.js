var express = require('express');
var router = express.Router({ mergeParams: true });
const locationsRouter = require('../locationsRouter');
const upload = require('../../services/file-upload');
const { ensureAuthenticated } = require('../../config/authentication');
const {
  handleGetRoom,
  handleGetAllRooms,
  handlePostRoom,
  handleDeleteRoom,
} = require('../../controllers/roomController');

router.use('/:room_id/locations', locationsRouter);

// TODO: handleGetAll rooms should take params from parent :user_id
router.get('/', handleGetAllRooms);

router.post('/', upload.single('image'), handlePostRoom);

router.get('/:room_id', handleGetRoom);

router.delete('/:room_id', handleDeleteRoom);

module.exports = router;

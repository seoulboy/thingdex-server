const mongoose = require('mongoose');
const { Room, User } = require('../models');
const emptyS3Directory = require('../services/file-delete');

// retrieves a room by a user
const handleGetRoom = async (req, res, next) => {
  try {
    const { user_id: userId, room_id: roomId } = req.params;

    if (
      mongoose.Types.ObjectId.isValid(userId) &&
      mongoose.Types.ObjectId.isValid(roomId)
    ) {
      const room = await Room.findById(roomId);
      res.status(200).json(room);
    } else {
      res.status(400).json({
        message: 'validation failed: handleGetRoom',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleGetRoom',
    });
    next(error);
  }
};

// retrives all rooms by a user
const handleGetAllRooms = async (req, res, next) => {
  try {
    const { user_id: userId } = req.params;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const rooms = await Room.find({ userId });

      res.status(200).json(rooms);
    } else {
      res.status(400).json({
        message: 'validation failed: handleGetAllRooms',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleGetAllRooms',
    });
    next(error);
  }
};

// creates a room data in room collection and user collection
const handlePostRoom = async (req, res, next) => {
  console.log(
    'FILE KEY: ',
    req.file.key,
    'FILE LOCATION: ',
    req.file.location,
    'FILE ETAG: ',
    req.file.etag
  );
  try {
    const { name } = req.body;
    var { etag: imageId, location: imageUrl } = req.file;
    const { user_id: userId } = req.params;

    imageId = JSON.parse(imageId);
    if (mongoose.Types.ObjectId.isValid(userId)) {
      if (name && imageUrl && userId && imageId) {
        const newRoom = await new Room({
          name,
          userId,
          imageUrl,
          imageId,
        }).save();

        const user = await User.findById(userId);
        user.rooms = user.rooms.concat(newRoom.id);
        user.save();

        console.log('room created', newRoom);
        res.status(200).json(newRoom);
      }
    } else {
      console.log('validation failed');
      res.status(400).json({
        message: 'validation failed: handlePostRoom',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'server error: handlePostRoom',
    });
    next(error);
  }
};

const handleDeleteRoom = async (req, res, next) => {
  try {
    const { room_id: roomId, user_id: userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(roomId)) {
      const room = await Room.findById(roomId);
      const user = await User.findById(userId);
      const { name } = room;

      user.rooms = user.rooms.filter(id => id !== roomId);
      user.save();
      await Room.findByIdAndDelete(roomId);
      await emptyS3Directory(userId, name);
      res.status(200).send({ message: `room deleted: ${name}` });
    } else {
      res.status(400).send({ error: 'invalid room id' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleDeleteRoom',
    });
    next(error);
  }
};

module.exports = {
  handleGetRoom,
  handleGetAllRooms,
  handlePostRoom,
  handleDeleteRoom,
};

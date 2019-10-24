const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });
const { Room, Location } = require('../../models');
const upload = require('../../services/file-upload');
const emptyS3Directory = require('../../services/file-delete');

const handleGetAllLocations = async (req, res, next) => {
  try {
    const { user_id: userId, room_id: roomId } = req.params;
    if (
      mongoose.Types.ObjectId.isValid(roomId) &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      const locations = await Location.find({ roomId });

      res.status(200).json(locations);
    } else {
      res.status(400).json({
        message: 'validation failed: handleGetAllLocations',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleGetAllLocations',
    });
    next(error);
  }
};

const handlePostLocation = async (req, res, next) => {
  try {
    const { item: items, location: name } = req.body;
    const { user_id: userId, room_id: roomId } = req.params;
    let { etag: imageId, location: imageUrl } = req.file;

    imageId = JSON.parse(imageId);

    if (
      mongoose.Types.ObjectId.isValid(roomId) &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      if (items && name && imageId && imageUrl) {
        const newLocation = await new Location({
          name,
          userId,
          roomId,
          items,
          imageId,
          imageUrl,
        }).save();

        console.log(newLocation);

        const room = await Room.findById(roomId);
        room.locations = room.locations.concat(newLocation._id);
        room.save();

        res.status(200).json(newLocation);
      }
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handlePostLocation',
    });
    next(error);
  }
};

const handleDeleteLocation = async (req, res, next) => {
  const {
    room_id: roomId,
    user_id: userId,
    location_id: locationId,
  } = req.params;

  // TODO: delete location
  try {
    if (
      mongoose.Types.ObjectId.isValid(roomId) &&
      mongoose.Types.ObjectId.isValid(userId) &&
      mongoose.Types.ObjectId.isValid(locationId)
    ) {
      const location = await Location.findById(locationId);
      const room = await Room.findById(roomId);
      const { name: locationName } = location;

      room.locations = room.locations.filter(id => id !== locationId);
      room.save();

      await Location.findByIdAndDelete(locationId);
      await emptyS3Directory(userId, room.name, locationName);

      res.status(200).send({ message: `location deleted: ${locationName}` });
    } else {
      res.status(400).send({ error: 'invalid location id' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleDeleteLocation',
    });
    next(error);
  }
};

// load all locations and item
router.get('/', handleGetAllLocations);

// create an location with items
router.post('/', upload.single('image'), handlePostLocation);

router.delete('/:location_id', handleDeleteLocation);

module.exports = router;

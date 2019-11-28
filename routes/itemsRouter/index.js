const mongoose = require('mongoose');
const router = require('express').Router({ mergeParams: true });
const { Room, Item } = require('../../models');
const {} = require('../../controllers');
const upload = require('../../services/file-upload');

const handlePutItem = async (req, res, next) => {
  try {
    const { item_id: itemId } = req.params;
    const { name, location, imageId, imageUrl } = req.body;
    if (mongoose.Types.ObjectId.isValid(itemId)) {
      const item = await Item.findByIdAndUpdate(
        itemId,
        {
          name,
          location,
          imageId,
          imageUrl,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      console.log(item);
      res.status(204).send('successful put request');
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handlePutItem',
    });
  }
};

const handleDeleteItem = async (req, res, next) => {
  try {
    const { item_id: itemId, room_id: roomId, user_id: userId } = req.params;

    if (
      mongoose.Types.ObjectId.isValid(itemId) &&
      mongoose.Types.ObjectId.isValid(roomId)
    ) {
      const item = await Item.findById(itemId);
      const room = await Room.findById(roomId);
      const { name } = item;

      room.items = room.items.filter(id => id !== itemId);
      room.save();
      await Item.findByIdAndDelete(itemId);
      res.status(200).send({ message: `item deleted: ${name}` });
    } else {
      res.status(400).send({ error: 'invalid item id' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleDeleteItem',
    });
  }
};

const handleGetItem = async (req, res, next) => {
  try {
    const { item_id: itemId } = req.params;

    if (mongoose.Types.ObjectId.isValid(itemId)) {
      const item = await Item.findById(itemId);
      res.status(200).json(item);
    } else {
      res.status(400).json({
        message: 'validation failed: handleGetItem',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleGetItem',
    });
    next(error);
  }
};

const handleGetAllItems = async (req, res, next) => {
  try {
    const { user_id: userId, room_id: roomId } = req.params;
    if (
      mongoose.Types.ObjectId.isValid(roomId) &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      const items = await Item.find({ roomId });

      res.status(200).json(items);
    } else {
      res.status(400).json({
        message: 'validation failed: handleGetAllItems',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handleGetAllItems',
    });
    next(error);
  }
};

const handlePostItem = async (req, res, next) => {
  console.log(
    'FILE KEY: ',
    req.file.key,
    'FILE LOCATION: ',
    req.file.location,
    'FILE ETAG: ',
    req.file.etag
  );
  try {
    const { item, location } = req.body;
    var { etag: imageId, location: imageUrl } = req.file;
    const { user_id: userId, room_id: roomId } = req.params;

    imageId = JSON.parse(imageId);
    if (
      mongoose.Types.ObjectId.isValid(roomId) &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      if (item && location && imageId && imageUrl) {
        const newItem = await new Item({
          name,
          location,
          imageId,
          imageUrl,
          userId,
          roomId,
        }).save();

        const room = await Room.findById(roomId);
        room.items = room.items.concat(newItem.id);
        room.save();

        res.status(200).json(newItem);
      }
    } else {
      res.status(400).json({
        message: 'validation failed: handlePostItem',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'server error: handlePostItem',
    });
    next(error);
  }
};

// endpoint that gets all items in a room from a user
router.get('/', handleGetAllItems);

// endpoint that creates an item
router.post('/:room_name', upload.single('image'), handlePostItem);

router.get('/:item_id', handleGetItem);

// endpoint that updates an existing item
router.put('/:item_id', handlePutItem);

// endpoint that deletes an existing item
router.delete('/:item_id', handleDeleteItem);

module.exports = router;

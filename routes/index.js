var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { Room, Location } = require('../models');
const { ensureAuthenticated } = require('../config/authentication');

const handleSearchItem = async (req, res, next) => {
  const { user_id: userId, search_string: searchString } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const locations = await Location.find({ userId });

      const found = locations.filter(location => {
        for (let i = 0; i < location.items.length; i++) {
          if (
            location.items[i].search(searchString.toUpperCase()) >= 0 ||
            location.items[i].search(searchString.toLowerCase()) >= 0
          ) {
            return true;
          }
        }
      });

      if (found.length) {
        const foundWithRoomName = await Promise.all(
          found.map(async each => {
            const room = await Room.findById(each.roomId);
            return { found: each, roomName: room.name };
          })
        );
        res.status(200).json(foundWithRoomName);
      } else {
        res.status(200).json({ message: `Item Not Found` });
      }
    }
  } catch (error) {
    next(error);
  }
};

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).send('hi');
});

router.get(
  '/search_item/:user_id/:search_string',
  // ensureAuthenticated,
  handleSearchItem
);

module.exports = router;

const mongoose = require('mongoose');
const { User } = require('../models');

const handleGetUser = async (req, res, next) => {
  try {
    const { user_id: userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      res.status(200).json({
        user,
      });
    } else {
      res.status(400).json({
        message: 'validation failed: handleGetUser',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'server error: handleGetUser',
    });
    return next(error);
  }
};

// TODO:  check later: can i use this in handlePostRoom in roomController?
// handlePutUser: endpoint made to add room ids in user data's room array.
const handlePutUser = async (req, res, next) => {
  try {
    const { room_id: roomId } = req.body;
    const { user_id: userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(roomId)) {
      const user = await User.findById(userId);

      user.rooms = user.rooms.concat(roomId);
      await user.save();
      res.status(200).json({ message: 'request successful : handlePutUser' });
    } else {
      res.status(400).json({ message: 'validation failed: handlePutUser' });
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ message: 'server error: handlePutUser' });
      return next(error);
    }
  }
};

const handlePostUser = async (req, res, next) => {
  const { name, authId, email, password, photo, authStrategy } = req.body;
  // TODO: save user to db await new User
  User.create(
    { name, authId, email, password, photo, authStrategy },
    (error, user) => {
      if (error) {
        console.error(error);
      }
      res.json(user);
    }
  );

};

module.exports = { handleGetUser, handlePutUser, handlePostUser };

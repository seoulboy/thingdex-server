const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  imageId: { type: String, required: true },
  locations: { type: [], required: true, default: [] },
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now().toString() }
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;

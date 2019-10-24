const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now().toString() },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: { type: [], required: true, default: [] },
  imageId: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;

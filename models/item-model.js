const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: () => Date.now() },
  imageId: { type: String, required: false },
  imageUrl: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Item = mongoose.model('item', ItemSchema);

module.exports = Item;


// room_id => mongoDB_ID
// user_id => mongoDB_ID
// location => string
// date_created => date
// date_edited => date
// image_id => string
// image_url => string
// name => string
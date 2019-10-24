const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({

  // TODO: generate a default photo url and set it to required..
  name: { type: String, required: true },
  authId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String },
  photo: { type: String },
  rooms: { type: [], required: true, default: [] },
  authStrategy: { type: String, required: true },
});

UserSchema.plugin(findOrCreate);

const User = mongoose.model('user', UserSchema);

module.exports = User;

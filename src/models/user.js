const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: String,
    require: true,
    length: {
      min: 1,
      max: 50,
    },
  },
  username: {
    type: String,
    require: true,
    length: {
      min: 8,
      max: 16,
    },
  },
  password: {
    type: String,
    require: true,
  },
  membership: {
    type: Boolean,
    require: true,
  },
  admin: {
    type: Boolean,
    require: true,
  },
});

module.exports = mongoose.model('User', UserSchema);

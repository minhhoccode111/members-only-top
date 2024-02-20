const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    length: {
      min: 1,
      max: 50,
    },
  },
  username: {
    type: String,
    required: true,
    length: {
      min: 8,
    },
  },
  password: {
    type: String,
    required: true,
    length: {
      min: 8,
      max: 32,
    },
  },
  member: {
    type: Boolean,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);

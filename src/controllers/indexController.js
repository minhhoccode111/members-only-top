const asyncHandler = require('express-async-handler');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');

// index handlers
module.exports.index = asyncHandler(async (req, res, next) => {
  res.send(`INDEX GET: NOT IMPLEMENTED`);
});

module.exports.about = (req, res, next) => {
  res.send(`ABOUT GET: NOT IMPLEMENTED`);
};

module.exports.logout = asyncHandler(async (req, res, next) => {
  res.send(`LOGOUT GET: NOT IMPLEMENTED`);
});

module.exports.login_get = asyncHandler(async (req, res, next) => {
  res.send(`LOGIN GET: NOT IMPLEMENTED`);
});

module.exports.login_post = asyncHandler(async (req, res, next) => {
  res.send(`LOGIN POST: NOT IMPLEMENTED`);
});

module.exports.signup_get = asyncHandler(async (req, res, next) => {
  res.send(`SIGNUP GET: NOT IMPLEMENTED`);
});

module.exports.signup_post = asyncHandler(async (req, res, next) => {
  res.send(`SIGNUP POST: NOT IMPLEMENTED`);
});

module.exports.message_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`MESSAGE DELETE GET: ID: ${req.params.id}: NOT IMPLEMENTED`);
});

module.exports.message_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`MESSAGE DELETE POST: ID: ${req.params.id}: NOT IMPLEMENTED`);
});

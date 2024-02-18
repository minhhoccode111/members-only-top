const asyncHandler = require('express-async-handler');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');

// user handlers
module.exports.create_get = asyncHandler(async (req, res, next) => {
  res.send(`CREATE GET: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.create_post = asyncHandler(async (req, res, next) => {
  res.send(`CREATE POST: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.upgrade_member_get = asyncHandler(async (req, res, next) => {
  res.send(`UPGRADE MEMBER GET: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.upgrade_member_post = asyncHandler(async (req, res, next) => {
  res.send(`UPGRADE MEMBER POST: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.upgrade_admin_get = asyncHandler(async (req, res, next) => {
  res.send(`UPGRADE ADMIN GET: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.upgrade_admin_post = asyncHandler(async (req, res, next) => {
  res.send(`UPGRADE ADMIN POST: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.downgrade_member = asyncHandler(async (req, res, next) => {
  res.send(`DOWNGRADE MEMBER GET: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});

module.exports.downgrade_admin = asyncHandler(async (req, res, next) => {
  res.send(`DOWNGRADE ADMIN POST: NOT IMPLEMENTED: USER ID: ${req.params.id}`);
});




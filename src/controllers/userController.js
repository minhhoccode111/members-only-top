// try...catch
const asyncHandler = require('express-async-handler');
// log
const debug = require('debug')('debug-custom');
// validation
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');

// user handlers
module.exports.create_get = (req, res, next) => {
  // not logged in
  if (!req.user) {
    debug(`not logged in yet so can't create new message, go back to /login route`);
    res.redirect('/login');
  } else {
    debug(`see if session user different from db user: db`, req.params.id);
    debug(`see if session user different from db user: session`, req.user.id);
    // try to user different id on the URL
    if (req.params.id !== req.user.id) {
      const err = new Error(`Invalid URL`);
      err.status = 404;
      next(err);
    }

    res.render('message-form', {
      title: 'New message',
      user: req.user,
    });
  }
};

module.exports.create_post = [
  //
  body('title').trim().notEmpty().escape(),
  body('content').trim().notEmpty().escape(),
  asyncHandler(async (req, res, next) => {}),
];

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

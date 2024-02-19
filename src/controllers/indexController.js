// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');

// index handlers
module.exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', {
    title: 'Home',
  });
});

module.exports.about = (req, res, next) => {
  res.send(`ABOUT GET: NOT IMPLEMENTED`);
};

module.exports.logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports.login_get = asyncHandler(async (req, res, next) => {
  res.render('login-form', {
    title: 'Login',
  });
});

module.exports.login_post = asyncHandler(async (req, res, next) => {
  res.send(`LOGIN POST: NOT IMPLEMENTED`);
});

module.exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render('signup-form', {
    title: 'Signup',
  });
});

module.exports.signup_post = [
  body(),
  asyncHandler(async (req, res, next) => {
    res.send(`SIGNUP POST: NOT IMPLEMENTED`);
  }),
];

module.exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    const err = new Error('Message Not Found');
    err.status = 404;
    next(err);
  }

  res.render('message-delete', {
    title: 'Confirm delete message',
    message,
  });
});

module.exports.message_delete_post = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    const err = new Error('Message Not Found');
    err.status = 404;
    next(err);
  }

  await Message.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

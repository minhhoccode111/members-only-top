// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');

// debug
const debug = require('debug')('debug-custom');

// bcrypt to secure password
const bcrypt = require('bcrypt');

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
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage(`Full name can't not be empty!`)
    .custom((value) => /^[a-zA-Z0-9\s]+$/gi.test(value))
    .withMessage(`Full name must be alphanumeric`)
    .escape(),
  body('username').trim().isLength({ min: 8 }).withMessage(`Username must be least 8 characters`).isEmail().withMessage(`That's not an email address.`).escape(),
  body('password')
    .trim()
    .isLength({ min: 8, max: 32 })
    .notEmpty()
    .withMessage(`Password must be between 8 and 32 characters!`)
    .isStrongPassword()
    .withMessage(`That's password is too weak. Please use at least 1 uppercase, 1 lowercase, 1 number, 1 special character!`)
    .escape(),
  body('password-confirm', `Confirm password does not match!`)
    .custom((value, { req }) => value === req.body.password)
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    const checkExisted = await User.findOne({ username: req.body.username }, 'username').exec();

    // check existence of username
    if (checkExisted !== null) {
      errors.push({ msg: `That username is already existed!` });
    }

    debug(`the error result is: `, errors);

    const user = new User({
      admin: false,
      membership: false,
      password: req.body.password, // need update if store in db
      fullname: req.body.fullname,
      username: req.body.username,
    });

    if (errors.length === 0) {
      const password = await bcrypt.hash(req.body.password, 10);
      user.password = password;
      await user.save();
      res.redirect('/login');
    } else {
      user['password-confirm'] = req.body['password-confirm'];
      res.render('signup-form', {
        title: 'Signup',
        user,
        errors,
      });
    }
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

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

// for login
const passport = require('passport');

// index handlers
module.exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({}).sort({ created_at: -1 }).populate('user').exec();

  debug(`user in index after logging in: `, req.user);

  res.render('index', {
    title: 'Home',
    messages,
    user: req.user,
  });
});

module.exports.about = (req, res) => {
  res.render('about', {
    title: 'About',
  });
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

module.exports.login_get = (req, res) => {
  // only not logged in user will be served form
  if (!req.user) {
    res.render('login-form', {
      title: 'Login',
      // alert wrong password or username
      messages: req.session.messages,
    });
  } else {
    res.redirect('/');
  }
};

module.exports.login_post = [
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  // success login
  (req, res) => {
    res.redirect('/');
  },
];

module.exports.signup_get = (req, res, next) => {
  // only not logged in user will be served form
  if (!req.user) {
    res.render('signup-form', {
      title: 'Signup',
    });
  } else {
    res.redirect('/');
  }
};

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
    .notEmpty()
		.withMessage(`Password contain all spaces?`)
    .isLength({ min: 8, max: 32 })
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
      member: false,
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
  // redirect to login if not logged in
  if (!req.user) {
    res.redirect('/login');
  } else if (!req.user.admin) {
    const id = req.user.id;
    res.redirect(`/user/${id}/upgrade/admin`);
  } else {
    const message = await Message.findById(req.params.id).populate({ path: 'user', select: 'fullname' }).exec();

    debug(`full detail about message: `, message);

    if (message === null) {
      const err = new Error('Message Not Found');
      err.status = 404;
      next(err);
    }

    res.render('delete-message-form', {
      title: 'Delete message',
      message,
    });
  }
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

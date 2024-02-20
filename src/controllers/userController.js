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
    // logged in but try to user different id on the URL
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
  body('title', `Title cannot be empty!`).trim().notEmpty().escape(),
  body('content', `Content cannot be empty!`).trim().notEmpty().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    const user = await User.findById(req.params.id).exec();

    if (user === null) {
      const err = new Error(`User not found`);
      err.status = 404;
      next(err);
    }

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      user,
    });

    if (errors.length !== 0) {
      res.render('message-form', {
        title: 'New message',
        user,
        errors,
      });
    } else {
      await message.save();
      res.redirect('/');
    }
  }),
];

module.exports.upgrade_member_get = (req, res, next) => {
  // not logged in
  if (!req.user) {
    debug(`Cannot upgrade member before logging in`);
    res.redirect('/login');
  }
  // logged in but try to user different id on the URL
  else if (req.params.id !== req.user.id) {
    const err = new Error(`Invalid URL`);
    err.status = 404;
    next(err);
  }
  // already a member but still try to access this URL
  else if (req.user.member) {
    debug(`You are already a member!`);
    res.redirect('/');
    // logged in and not member
  } else {
    res.render('member-form', {
      title: 'Upgrade to member',
      user: req.user,
    });
  }
};

module.exports.upgrade_member_post = [
  body('member-passcode', `Wrong passcode`).custom((value) => value === process.env.MEMBER_PASSCODE),

  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    const user = await User.findById(req.params.id).exec();

    if (user === null) {
      const err = new Error(`User not found`);
      err.status = 404;
      next(err);
    }

    debug(process.env.MEMBER_PASSCODE);

    if (error.isEmpty()) {
      user.member = true;
      await user.save();
      res.redirect('/');
    } else {
      // wrong passcode
      res.render('member-form', {
        title: 'Upgrade member',
        wrongPasscode: true,
        user: req.user,
      });
    }
  }),
];

module.exports.upgrade_admin_get = asyncHandler(async (req, res, next) => {
  // not logged in
  if (!req.user) {
    debug(`Cannot upgrade admin before logging in`);
    res.redirect('/login');
  }
  // logged in but try to user different id on the URL
  else if (req.params.id !== req.user.id) {
    const err = new Error(`Invalid URL`);
    err.status = 404;
    next(err);
  }
  // already a member but still try to access this URL
  else if (req.user.admin) {
    debug(`You are already a admin!`);
    res.redirect('/');
    // logged in and not member
  } else {
    res.render('admin-form', {
      title: 'Upgrade to admin',
      user: req.user,
    });
  }
});

module.exports.upgrade_admin_post = [
  body('admin-passcode', `Wrong passcode`).custom((value) => value === process.env.ADMIN_PASSCODE),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    const user = await User.findById(req.params.id).exec();

    if (user === null) {
      const err = new Error(`User not found`);
      err.status = 404;
      next(err);
    }

    debug(process.env.ADMIN_PASSCODE);

    if (error.isEmpty()) {
      user.admin = true;
      await user.save();
      res.redirect('/');
    } else {
      // wrong passcode
      res.render('admin-form', {
        title: 'Upgrade admin',
        wrongPasscode: true,
        user: req.user,
      });
    }
  }),
];

module.exports.downgrade_member = asyncHandler(async (req, res, next) => {
  // not logged in yet
  if (!req.user) {
    debug(`You are not logged in yet`);
    res.redirect('/');

    // try to use wrong URL
  } else if (req.user.id !== req.params.id) {
    const err = new Error(`Invalid URL`);
    err.status = 404;
    next(err);

    // downgrade an account not a member yet
  } else if (!req.user.member) {
    debug(`You are not a member yet`);
    res.redirect('/');
  } else {
    const user = await User.findById(req.user.id).exec();
    user.member = false;
    await user.save();
    res.redirect('/');
  }
});

module.exports.downgrade_admin = asyncHandler(async (req, res, next) => {
  // not logged in yet
  if (!req.user) {
    debug(`You are not logged in yet`);
    res.redirect('/');

    // try to use wrong URL
  } else if (req.user.id !== req.params.id) {
    const err = new Error(`Invalid URL`);
    err.status = 404;
    next(err);

    // downgrade an account not a admin yet
  } else if (!req.user.admin) {
    debug(`You are not a admin yet`);
    res.redirect('/');

    // downgrade if nothing wrong
  } else {
    const user = await User.findById(req.user.id).exec();
    user.admin = false;
    await user.save();
    res.redirect('/');
  }
});

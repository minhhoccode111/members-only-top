const RateLimit = require('express-rate-limit');
// const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const debug = require('debug')('debug-custom');

// connect database
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const dev_db_url = 'mongodb+srv://minhhoccode111:FOgvsF1s5IS6siuj@cluster0.hvlxd0y.mongodb.net/?retryWrites=true&w=majority';

const mongoDB = process.env.MONGODB_URI || dev_db_url;

main()
  .then(() => debug('connected to database'))
  .catch((err) => debug('an error occur: ', err));

async function main() {
  await mongoose.connect(mongoDB);
}

// routes controllers
const indexRouter = require('./src/routes/index');
const userRouter = require('./src/routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// reduce fingerprinting
app.disable('x-powered-by');

// rate limit
const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 200 }); // max 20 per 1 minute
app.use(limiter);

// compress responses for performance
app.use(compression());
// security HTTP header
app.use(helmet.contentSecurityPolicy({ directives: { 'script-src': ["'self'"] } }));

// basic setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser({ secret: process.env.SECRET })); // may not need this when we have session
app.use(express.static(path.join(__dirname, 'public')));

// session
const session = require('express-session');
const passport = require('passport');

// session object
const ses = {
  secret: process.env.SECRET,
  resave: false, // should we resave the session hasn't been modified, performance gain
  saveUninitialized: true, // whether a session be created for new but not yet modified session
  // TODO change to 7 days after develop
  // cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  cookie: { maxAge: 1000 * 60 * 2 }, // 2 mins
};

// use secure in production but allowing for testing in development
debug(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  ses.cookie.secure = true; // serve secure cookies, only allow cookies on HTTPS
}

app.use(session(ses)); // set session
app.use(passport.initialize());
app.use(passport.session());
// TODO serialize and deserialize should be add when login

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: 'Something broke',
    title: 'Error!',
  });
});

module.exports = app;

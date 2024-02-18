const RateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser()); // this may result in issues if the secret is not the same between this module and session
app.use(express.static(path.join(__dirname, 'public')));

// session
const session = require('express-session');
const passport = require('passport');
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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

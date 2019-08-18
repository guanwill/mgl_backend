const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const gamesRouter = require('./routes/games');
require('./passport');
require('./db');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/api/v1/games', passport.authenticate('jwt', { session: false }), gamesRouter); // requires authentication/token to access this route

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

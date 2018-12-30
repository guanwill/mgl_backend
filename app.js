var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var flash = require('connect-flash');

// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // to use username and password for authentication

// Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

// Routes
var indexRouter = require('./routes/users');

var app = express();

// Db connection
mongoose.connect('mongodb://localhost/addy', { useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

// Express session config
// Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side
app.use(require('express-session')({
  secret: 'keyboard cat', // to hash session data
  cookie: {maxAge: 86400000},
  resave: false,
  saveUninitialized: false
}));

// Passport config
app.use(passport.initialize()); // use passport in express
app.use(passport.session()); // for persistent login sessions
const User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate())); // reason why we require User above
passport.serializeUser(function (user, done) {
  // Store the user in session for retrieval
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  // to retrieve user based on user stored above
  done(null, user);
});

// View engine setup
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

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

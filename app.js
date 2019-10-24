// dotenv Config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
// router
const indexRouter = require('./routes/index'),
  usersRouter = require('./routes/usersRouter'),
  roomsRouter = require('./routes/roomsRouter'),
  authRouter = require('./routes/authRouter');
const passportSetup = require('./config/passportSetup');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { domain } = require('./constants');

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// cookie session
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
  })
);

// initialize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(
  passport.session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false,
  })
);

// Connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose
  .connect(require('./config/keys').mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    mongoose.connection.readyState == 1
      ? console.log('connected to mongoDB server')
      : console.log('failed connection to mongoDB server');
  }) // connected)})
  .catch(error => console.error(error));

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: `http://192.168.0.47:3000`, // allow to server to accept request from different origin
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, //allow session cookie from browser to pass throught
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set up routes
app.use('/api/users', usersRouter);
app.use('/auth', authRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;

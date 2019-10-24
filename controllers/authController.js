const passport = require('passport');
const bcrypt = require('bcryptjs');

const { domain } = require('../constants/')
const CLIENT_HOME_PAGE_URL = `http://192.168.0.47:3000`;
const AUTH_FAIL_REDIRECT_URL = '/auth/login/failed';
const { User } = require('../models/index');

const randomStringGenerator = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

const registerUser = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    console.error('passwords do not match');
  }
  if (password.length < 6) {
    console.error('password must be at least 6 characeters');
  }

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(200).json(user);
    }
    const newUser = new User({
      name,
      email,
      password,
      authId: randomStringGenerator(),
      authStrategy: 'local',
    });

    bcrypt.genSalt(10, (error, salt) => {
      if (error) throw error;
      bcrypt.hash(newUser.password, salt, async (error, hash) => {
        if (error) throw error;
        newUser.password = hash;
        await newUser.save();
        res.redirect(CLIENT_HOME_PAGE_URL);
      });
    });
  } catch (error) {
    throw error;
  }
};

// TODO: error handling here..
const handleLogin = (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect(CLIENT_HOME_PAGE_URL);
      });
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, handleLogin };

const router = require('express').Router();
const passport = require('passport');
const { domain } = require('../../constants/')

const CLIENT_HOME_PAGE_URL = `${domain}`;
const AUTH_FAIL_REDIRECT_URL = '/auth/login/failed';

const {
  registerUser,
  handleLogin,
  redirectToLoginPage,
  redirectToRegisterPage,
} = require('../../controllers');

// when login is successful, retrieve user info
router.get('/login/success', (req, res) => {
  if (req.user) {
    console.log(`login successful ${req.user.name}`);
    return res.json({
      authenticated: true,
      message: 'user has successfully authenticated',
      user: req.user,
      cookies: req.cookies,
    });
  }

});

// when login failed, send failed msg
router.get('/login/failed', (req, res) => {
  console.log('you reached login failure');
  res.status(401).json({
    success: false,
    message: 'user failed to authenticate.',
  });
});

// When logout, redirect to client
router.get('/logout', (req, res) => {
  console.log('user logged out');
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

// redirect after authentication
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: AUTH_FAIL_REDIRECT_URL,
  })
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    authType: 'reauthenticate',
    scope: ['email'],
  })
);

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: AUTH_FAIL_REDIRECT_URL,
  })
);

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['profile', 'user'],
  })
);

router.get(
  '/github/redirect',
  passport.authenticate('github', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: AUTH_FAIL_REDIRECT_URL,
  })
);

router.get(
  '/twitter',
  passport.authenticate('twitter', {
    scope: ['profile'],
  })
);

router.get(
  '/twitter/redirect',
  passport.authenticate('twitter', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: AUTH_FAIL_REDIRECT_URL,
  })
);

//TODO: controllers: error handling: what if register failed? what if login failed?

router.post('/local/register', registerUser);

router.post('/local/login', handleLogin);

module.exports = router;

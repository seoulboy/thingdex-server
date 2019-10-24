const { domain } = require('../constants')


const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
(FacebookStrategy = require('passport-facebook').Strategy),
  (GithubStrategy = require('passport-github').Strategy),
  (TwitterStrategy = require('passport-twitter').Strategy),
  (LocalStrategy = require('passport-local').Strategy);

const bcrypt = require('bcryptjs');
const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '${domain}/auth/google/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('google auth passport callback function fired');
      try {
        User.findOrCreate(
          { authId: profile.id },
          {
            name: profile._json.name,
            email: profile._json.email,
            photo: profile._json.picture,
            authStrategy: 'google',
          },
          (error, user) => {
            if (error) throw error;
            console.log('found or created a user: ', user);
            done(null, user);
          }
        );
      } catch (error) {
        if (error) {
          console.error(error);
        }
      }
    }
  )
);

// TODO: add emails to db... (1) delete first.. google & fb done. now to github twitter instagram...
passport.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '${domain}/auth/facebook/redirect',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('fb auth passport callback fired');
      console.log('facebook', profile._json.picture.data.url);
      try {
        User.findOrCreate(
          { authId: profile._json.id },
          {
            name: profile._json.name,
            email: profile._json.email,
            photo: profile._json.picture.data.url,
            authStrategy: 'facebook',
          },
          (error, user) => {
            if (error) throw error;
            console.log('found or created a user: ', user);
            done(null, user);
          }
        );
      } catch (error) {
        if (error) {
          console.error(error);
        }
      }
    }
  )
);

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${domain}/auth/github/redirect`,
      scope: ['profile', 'user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('github auth passport callback fired');
      try {
        User.findOrCreate(
          { authId: profile._json.id },
          {
            name: profile._json.name,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            authStrategy: 'github',
          },
          (error, user) => {
            if (error) throw error;
            done(null, user);
          }
        );
      } catch (error) {
        if (error) {
          console.error(error);
        }
      }
    }
  )
);

passport.use(
  'twitter',
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${domain}/auth/twitter/redirect`,
      includeEmail: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('twitter auth passport callback fired'); 
      try {
        User.findOrCreate(
          { authId: profile._json.id },
          {
            name: profile._json.name,
            email: profile._json.email,
            photo: profile.photos[0].value,
            authStrategy: 'twitter',
          },
          (error, user) => {
            if (error) throw error;
            console.log('found or created a user: ', user);
            done(null, user);
          }
        );
      } catch (error) {
        if (error) {
          console.error(error);
        }
      }
    }
  )
);

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        console.log('found user in db', user);
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) {
            console.error(error);
            throw error;
          }
          if (isMatch) {
            console.log('isMatch');
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

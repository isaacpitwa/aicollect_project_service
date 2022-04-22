/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import passport from 'passport';
import PassportGoogle from 'passport-google-oauth20';
import MockPass from '@passport-next/passport-mocked';
// import UserService from '../../database/models/user';

dotenv.config();

let GoogleStrategy;

if (process.env.NODE_ENV !== 'test') {
  GoogleStrategy = PassportGoogle.Strategy;
} else {
  GoogleStrategy = MockPass.OAuth2Strategy;
}

const getProfile = (accessToken, refreshToken, profile, done) => {
  try {
    const firstname = profile._json.first_name || profile._json.given_name;
    const lastname = profile._json.last_name || profile._json.family_name;
    const email = profile.emails[0].value;
    const user = { firstname, lastname, email };
    done(null, user);
  } catch (error) {
    done(error);
  }
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  name: 'google',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
getProfile));

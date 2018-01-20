const passport = require('passport');
const request = require('request');
const InstagramStrategy = require('passport-instagram').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const OpenIDStrategy = require('passport-openid').Strategy;
const OAuthStrategy = require('passport-oauth').OAuthStrategy;
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const HttpStatus = require('http-status-codes');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
* Sign in with Facebook Token.
*/
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET
}, function (accessToken, refreshToken, profile, done) {
  console.log("FacebookTokenStrategy");
  console.log("profile", profile);
  User.findOne({ facebook: profile.id }, (err, existingUser) => {
    console.log("err", err);
    console.log("existing user", existingUser);
    if (err) { return done(err); }
    if (existingUser) {
      return done(null, existingUser);
    }
    User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
      if (err) { return done(err); }
      if (existingEmailUser) {
        //req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
        console.log("existingEmailUser ");
        existingEmailUser.facebook = profile.id;
        existingEmailUser.tokens.push({ kind: 'facebook', accessToken });
        existingEmailUser.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
        existingEmailUser.profile.gender = profile._json.gender;
        existingEmailUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        existingEmailUser.profile.location = (profile._json.location) ? profile._json.location.name : '';

        done(err, existingEmailUser);
      } else {
        const user = new User();
        user.email = profile._json.email;
        user.facebook = profile.id;
        user.tokens.push({ kind: 'facebook', accessToken });
        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
        user.profile.gender = profile._json.gender;
        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        user.profile.location = (profile._json.location) ? profile._json.location.name : '';
        user.save((err) => {
          done(err, user);
        });
      }
    });
  });
}
));

function handlerUnauthorized(res) {
  return res.status(HttpStatus.UNAUTHORIZED)
    .send({
      error: {
        msg: __("Authentication needed, please login to access to this page")
      }
    });

}
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated req: ", req);

  console.log("isAuthenticated req user: ", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  handlerUnauthorized(res);
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    handlerUnauthorized(res);
  }
};

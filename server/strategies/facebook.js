var passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    users = require('../components/users/userController');

module.exports = function() {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true
  }, function(req, res, accessToken, refreshToken, profile, done){
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
    var providerUserProfile = {
      firstName: providerData.first_name,
      lastName: providerData.last_name,
      fullname: providerData.name,
      email: providerData.email,
      provider: 'facebook',
      providerId: providerData.id,
      providerData: providerData
    };
    
    users.facebookLogin(req, res, providerUserProfile, done);
  }));
};
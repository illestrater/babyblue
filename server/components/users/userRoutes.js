var users = require('./userController'),
    passport = require('passport');

module.exports = function(app) {

  app.post('/registeruser', users.register);
  app.get('/getplayers', users.getPlayers);

  // Passport Authentication
//  app.route('/signin')
//    .get(users.renderSignin)
//    .post(passport.authenticate('local', {
//      successRedirect: '/',
//      failureRedirect: '/signin',
//      failureFlash: true
//  }));
  
  app.post('/login', users.login);
  app.get('/logout', users.logout);
  
  app.get('/loggedin', users.loggedin);
  
  //OAuth Authentication
  app.get('/oauth/facebook', passport.authenticate('facebook', {
    failureRedirect: '/signin',
    scope: ['email', 'public_profile']
  }));
  app.get('/oauth/facebook/callback', users.facebookCallback);
  
  app.get('/session', users.getSession);
  
//  app.get('/oauth/facebook/profilepicture', function (req, res, next) {
//    var id = req.query.user;
//    console.log("hello" + id);
//    // HTTP get graph api using id.
//    // facebookCallback users function has response with user object
//  });

};
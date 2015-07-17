var User = require('mongoose').model('User'),
    passport = require('passport');

var errorMessage = 'Server error, bummer! Please e-mail timkang@unc.edu';

var getErrorMessage = function(err) {
  var message = '';
  
  if(err.code) {
      message = errorMessage;
  } else {
    for(var errName in err.errors) {
      if(err.errors[errName].message) 
        message = err.errors[errName].message;
    }
  }
  
  return message;
};

exports.login = function(req, res, next) {
  User.findOne({
    'user.email' : req.body.email,
  }, function(err, user) {
    if(err) {
      return next(err);
    } else if(!user) {
      return res.status(401).send("Could not find user with email: " + req.body.email);
    } else {
      if(user.hashPassword(req.body.password) != user.user.password){
        return res.status(401).send("Invalid password");
      } else {
        req.login(user, function(err) {
          if (err) return next(err);
          return res.send("Valid password");
        });
      }
    }
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.loggedin = function(req, res, next){
  if(req.user){
    res.send(req.user);
  } else {
    res.send("no");
  }
}

exports.facebookLogin = function(req, res, profile, done) {
  console.log(profile.provider + ' ' + profile.providerId);
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId
  }, function(err, user) {
    if(err) {
      return done(err);
    } else {
      console.log(profile);
      if(!user){
        return done(err, profile);
      } else {
        return done(err, user);
      }
    }
  });
};

exports.facebookCallback = function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err) { return next(err); }
    // If user is not registered
    if (user.firstName) {
      req.session.first = user.firstName;
      req.session.last = user.lastName;
      req.session.email = user.email;
      req.session.provider = user.provider;
      req.session.providerId = user.providerId;
      return res.redirect('/registration'); 
    } else {
      req.login(user, function(err) {
        if (err) return next(err);
        return res.redirect('/players');
      });
    }
  })(req, res, next);
};

exports.register = function(req, res, next) {
  User.find({ "user.email" : req.body.user.email }, function(err, user) {
    if(err) {
      return res.status(500).send({ error: getErrorMessage(err) });
    } else if(!req.user) {
      if(!user.length){
        var user = new User(req.body);
        var message = null;
        if(req.body.provider == 'facebook'){
          user.provider = 'facebook';
        } else {
          user.provider = 'local';
        }

        user.save(function(err, data) {
          if(err) {
            return res.status(500).send({ error: getErrorMessage(err) });
          }
          req.login(user, function(err) {
            if (err) return next(err);
            return res.send(data);
          });
          
        });
      } else {
        return res.status(500).send({ error: 'Email already exists' });
      }
    } else {
      return res.status(500).send({ error: 'You are already logged in' });
    }
  });
};

exports.getPlayers = function(req, res, next) {
  User.find({}, 'user.first user.last user.nickname', function(err, user) {
    if(err) {
      res.status(500).send({ error: getErrorMessage(err) });
    } else {
      return res.send(user);
    }
  });
};

exports.getSession = function(req, res, next) {
    return res.send({ first: req.session.first, last: req.session.last, email: req.session.email, provider: req.session.provider, providerId: req.session.providerId });
};
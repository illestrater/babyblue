// Include Dependencies
var config = require('./config');
    express = require('express');
    path = require('path');
    favicon = require('serve-favicon');
    logger = require('morgan');
    compress = require('compression'),
    cookieParser = require('cookie-parser');
    methodOverride = require('method-override'),
    swig = require('swig');
    bodyParser = require('body-parser');
    nodemailer = require('nodemailer');
    session = require('express-session');
    flash = require('connect-flash');
    passport = require('passport');

var home = require('./routes/index');

module.exports = function() {
  var app = express();
  
  // Swig Templating Engin
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../client'));
 
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  //app.use(favicon(__dirname + '/illestraterLogo.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../client')));
  
  // Routes
  require('./components/users/userRoutes.js')(app);
  require('./components/indexing/indexRoutes.js')(app);
//  app.use('/', home);

  // ERROR HANDLERS
  // 404 Error Handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Development Error Handler
  // print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // Production Error Handler
  // stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  
  return app;
}

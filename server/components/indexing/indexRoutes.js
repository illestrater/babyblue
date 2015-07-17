module.exports = function(app) {
  var index = require('./indexController');
  app.get('/', index.render);
  app.get('/home', index.render);
  app.get('/players', index.render);
  app.get('/registration', index.render);
  app.get('/rules', index.render);
}
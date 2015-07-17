var express = require('express');
var router = express.Router();

/* Route Pages */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Baby Blue' });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Baby Blue' });
});

router.get('/registration', function(req, res, next) {
  res.render('index', { title: 'Baby Blue' });
});

router.get('/players', function(req, res, next) {
  res.render('index', { title: 'Baby Blue' });
});


module.exports = router;
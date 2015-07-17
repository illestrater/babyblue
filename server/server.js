process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./mongoose'),
    express = require('./express'),
    passport = require('./passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(4000);

module.exports = app;

console.log('Server running at http://localhost:4000');
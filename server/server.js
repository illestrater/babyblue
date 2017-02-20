process.on('uncaughtException', (err) => {
  console.log(err);
});

const config = require('./config/config.js');
require('./mongoose')();
const app = require('./express')();

const port = config.apiServer.port;

module.exports = app;

console.log(`Server running at ${port}`);

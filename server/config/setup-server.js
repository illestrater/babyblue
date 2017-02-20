'use strict';
const path          = require('path');
const recursive     = require('recursive-readdir');

module.exports = function setupServer(app) {
    recursive('./server/controllers', [], function _mountCtrlRoutes(err, files) {
        if (err) { throw err; }

        files.forEach(file => {
            require(path.resolve(file)).init(app);
        });
    });
};

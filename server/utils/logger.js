'use strict';
/* eslint no-console: 0 */
const config         = require('../config/config');
// Set colors on to get them in gulp
process.env.DEBUG_COLORS = true;
process.env.DEBUG_FD     = 1;
require('debug').enable(process.env.DEBUG);

const baseLoggerName = 'depot:api';

// Set process.env.LOGGER_ENABLED=false to disable all logging
class Logger {
    constructor(loggerName) {
        this.loggerName = (loggerName) ? `${baseLoggerName}:${loggerName}` : baseLoggerName;
        this._log   = null;
        this._debug = null;
        this._warn  = null;
        this._error = null;
    }
    log(args) {
        if (!config.loggerEnabled) { return; }

        this._log = (this._log) ? this._log : require('debug')(`${this.loggerName}:log`);
        this._log.apply(this._log, arguments);
    }
    debug(args) {
        if (!config.loggerEnabled) { return; }

        this._debug = (this._debug) ? this._debug : require('debug')(this.loggerName);
        this._debug.apply(this._debug, arguments);
    }
    warn(args) {
        if (!config.loggerEnabled) { return; }

        this._warn = (this._warn) ? this._warn : require('debug')(`${this.loggerName}:warn`);
        this._warn.apply(this._warn, arguments);
    }
    error(args) {
        if (!config.loggerEnabled) { return; }

        this._error = (this._error) ? this._error : require('debug')(`${this.loggerName}:error`);
        this._error.apply(this._error, arguments);
    }
}

const loggerFactory = function _loggerFactory(loggerName) {
    return new Logger(loggerName);
};

module.exports = loggerFactory;

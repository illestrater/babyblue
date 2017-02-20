'use strict';
const winston = require('winston');
const moment = require('moment');
const config = require('../config/config');

const Daily = require('winston-daily-rotate-file');
winston.emitErrs = true;

// Formats logs to start with time stamp, level, and then message and meta data
function formatLog(options) {
    const message = (undefined !== options.message ? options.message : '');
    const meta = (options.meta && Object.keys(options.meta).length ? `${JSON.stringify(options.meta)}` : '');
    return `${options.timestamp()} ${options.level.toUpperCase()} ${message} ${meta}`;
}

winston.loggers.add('chat', {
    transports: [
        new (Daily)({
            timestamp: () => {
                const now = moment().format('YYYY-MM-DD HH:mm:ss:SSS');
                return now;
            },
            formatter:        (options) => formatLog(options),
            name:             'chat-file',
            filename:         `${config.logPath}/chat.log`,
            datePattern:      '.yyyy-MM-dd',
            maxsize:          '10000000',
            handleExceptions: true,
            json:             false,
            colorize:         false
        })
    ]
});

winston.loggers.add('error', {
    transports: [
        new (Daily)({
            timestamp: () => {
                const now = moment().format('YYYY-MM-DD HH:mm:ss:SSS');
                return now;
            },
            formatter:        (options) => formatLog(options),
            name:             'error-file',
            filename:         `${config.logPath}/error.log`,
            datePattern:      '.yyyy-MM-dd',
            maxsize:          '10000000',
            handleExceptions: true,
            json:             false,
            colorize:         false
        })
    ]
});

const accessLogger = winston.loggers.get('access');
module.exports.access = accessLogger;
const chatLogger = winston.loggers.get('chat');
module.exports.chat = chatLogger;
const errorLogger = winston.loggers.get('error');
module.exports.error = errorLogger;

// Prevents Node from closing when there is an error with logging
accessLogger.exitOnError = false;
chatLogger.exitOnError = false;
errorLogger.exitOnError = false;

// Access logs writer, used by express middleware / morgan
module.exports.stream = {
    write: (message, encoding) => {
        accessLogger.info(message);
    }
};

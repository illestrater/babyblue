const config = require('../config/config.js');
const mockUtils = module.exports = {};
/* eslint no-console: 0 */

// If config.apiServer.mockData is truthy will send the data over response and log a warning, returns true
// If config.apiServer.mockData is falsy will just return false
mockUtils.sendIfMockEnabled = (response, data, logger) => {
    if (!config.apiServer.mockData) { return false; }
    if (logger) {
        logger.warn('MockData enabled, sending mockdata to client, skipping database connection');
    } else {
        console.log('MockData enabled, sending mockdata to client, skipping database connection');
    }

    response.status(200).send(data);
    return true;
};

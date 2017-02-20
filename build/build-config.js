const path = require('path');

const CONFIG = {
    DEVELOPMENT: {
        uiPort:  5000,
        apiPort: 4000
    },
    UI: {
        NAME: 'BABYBLUE',
        UI:   {
            DOC_TITLE:        'Baby Blue Basketball',
            BASE_DIR:         path.resolve('client', 'app'),
            APP_DIR:          path.resolve('client', 'app'),
            ENTRY_FILE:       path.resolve('client', 'app', 'index.js'),
            DEV_PORT:         5000,
            BUILD_DIR_SUFFIX: 'babyblue-ui'
        }
    },
    SERVER: {
        BASE_DIR:         path.resolve('server'),
        ENTRY_FILE:       path.resolve('bin', 'www'),
        TEST_DIR:         path.resolve('server', 'test'),
        PORT:             4000,
        BUILD_DIR_SUFFIX: 'babyblue-api'
    }
};


module.exports = CONFIG;

require('dotenv').config();     // Bring in environment vars defined in .env
/**
* Environment variables and application configuration.
*/

const ENV = process.env;

const CONFIG = {
    env:           ENV.NODE_ENV                         || 'production',
    loggerEnabled: (ENV.LOGGER_ENABLED === 'true'),
    logPath:       ENV.LOG_PATH,
    apiServer:     {
        port:        ENV.API_SERVER_PORT                || 4000,
        host:        ENV.API_SERVER_HOST                || '0.0.0.0',
        cert:        ENV.CERT_LOCATION                || '0.0.0.0',
        jwtSecret:   ENV.API_SERVER_JWT_SECRET          || '12345',
        mockData:    (ENV.API_SERVER_MOCK_DATA === 'true')
    },
    querytoolDatabase: {
        connection: {
            user:          ENV.DB_QT_USER               || null,
            password:      ENV.DB_QT_PASS               || null,
            connectString: ENV.DB_QT_CONNECT_STRING     || null
        },
        debug: (ENV.DB_QT_DEBUG === 'true')
    },
    scorecardsDatabase: {
        connection: {
            user:          ENV.DB_SC_USER               || null,
            password:      ENV.DB_SC_PASS               || null,
            connectString: ENV.DB_SC_CONNECT_STRING     || null
        },
        debug: (ENV.DB_SC_DEBUG === 'true')
    },
    mongoose: {
        db: 'mongodb://localhost/babyblue',
        sessionSecret: 'babyblueSessionSecret',
        facebook: {
            clientID: '1624147191236844',
            // clientID: '1624151074569789',
            clientSecret: '5565af34f5719bfe4a6f177f5d37eef8',
            callbackURL: 'http://localhost:5000/oauth/facebook/callback'
        }
    }
};

module.exports = CONFIG;

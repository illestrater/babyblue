// Required first to allow setting for npm's debug package to use .env setting
const config     = require('./config/config.js');

const fs         = require('fs');
const path       = require('path');
const https      = require('https');
const express    = require('express');
const morgan     = require('morgan');
const winston    = require('./services/winston');
const bodyParser = require('body-parser');
const swig       = require('swig');
const logger     = require('./utils/logger')('server');
const routes     = require('./routes');
const cors       = require('cors');

module.exports = () => {
    const app = express();
    logger.log('Starting API Server');

    app.use(cors({ credentials: true }));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    app.use(morgan(':method :url :status :response-time ms - :res[content-length]',
                   { stream: winston.stream }));

    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.use('/', express.static(path.join(__dirname, '/../_dist/babyblue-ui')));

    require('./models/users/userRoutes.js')(app);
    routes.init(app);

    app.use((req, res) => {
        res.status(404).send({ status: 404, message: 'No matching route found' });
    });

    const sslPath = config.apiServer.cert;
    const options = {
        key:  fs.readFileSync(`${sslPath}/privkey.pem`, 'utf8'),
        cert: fs.readFileSync(`${sslPath}/fullchain.pem`, 'utf8')
    };
    const server = https.createServer(options, app);
    server.listen(config.apiServer.port);

    return app;
};

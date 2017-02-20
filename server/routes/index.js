const RootCtrl = require('./common/root-controller');

const routes = module.exports = {};

routes.init = function _init(app) {
    RootCtrl.init(app);

    // Root Handler
    app.get('/api', RootCtrl.getRoutes);

    return app;
};

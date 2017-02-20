'use strict';
let server = null;

exports.getRoutes = function _getRoutes(req, res) {
    const routes = [];

    server.router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            routes.push({
                path:    r.route.path,
                methods: r.route.methods
            });
        }
    });

    res.status(200).send(routes);
};

exports.init = function _init(app) {
    server = app;
    return app;
};

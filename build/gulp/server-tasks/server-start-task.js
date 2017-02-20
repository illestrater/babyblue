module.exports = function serverTask(gulp, gulpPlugins, options) {
    return function _serverTask() {
        gulpPlugins.developServer.listen({ path: options.targetApp.ENTRY_FILE });
    };
};

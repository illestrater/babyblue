module.exports = function serverWatchTask(gulp, gulpPlugins, options) {
    return function _serverWatchTask() {
        const watchGlobs = [
            options.targetApp.BASE_DIR + '/**/*.js',
            options.targetApp.TEST_DIR + '/**/*.js'
        ];

        gulp.watch(watchGlobs, gulpPlugins.developServer.restart);
    };
};

import handleGulpError from '../utils/handle-gulp-error.js';

module.exports = function serverTestTask(gulp, gulpPlugins, options) {
    return function _serverTaskTask() {
        // TODO: This isn't find the test files, need to figure it out.
        const testFiles = options.targetApp.API.TEST_DIR + '\\**\\*.js';
        gulpPlugins.util.log('TESTFILES', testFiles);

        return gulp.src(testFiles)
            .pipe(gulpPlugins.plumber({
                errorHandler: handleGulpError
            }))
            .pipe(gulpPlugins.jasmine())
            .pipe(gulpPlugins.istanbul.writeReports()) // Creating the reports after tests ran and enforce threshold
            .pipe(gulpPlugins.istanbul.enforceThresholds({
                thresholds: {
                    global: 0
                }
            }));
    };
};

import handleGulpError from '../utils/handle-gulp-error.js';

module.exports = function coverageTask(gulp, gulpPlugins, options) {
    return function _coverageTask() {
        return gulp.src(options.COVERAGE.src)
            .pipe(gulpPlugins.plumber({
                errorHandler: handleGulpError
            }))
            .pipe(gulpPlugins.istanbul({
                includeUntested: false
            }))
            .pipe(gulpPlugins.istanbul.hookRequire());
    };
};

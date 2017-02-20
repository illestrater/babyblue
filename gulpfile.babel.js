import gulp from 'gulp';
import runSequence            from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import path from 'path';
import BUILD_CONFIG from './build/build-config';

/* ********************************** */
/* Common Targets                     */
/* ********************************** */
import webpackDevServerTask from './build/gulp/client-tasks/webpack-dev-task';
import webpackBuildTask     from './build/gulp/client-tasks/webpack-build-task';
import serverStartTask      from './build/gulp/server-tasks/server-start-task';
import serverWatchTask      from './build/gulp/server-tasks/server-watch-task';

// Load all the gulp plugins defined in package.json
const GULP_PLUGINS = gulpLoadPlugins();

const BUILD_ROOT = path.resolve(__dirname, '_dist');
global.isProd = false;

/* ********************************** */
/* Task Rollups                       */
/* ********************************** */
gulp.task('dev', () => {
    runSequence('dev:server', 'dev:ui');
});

gulp.task('build', ['clean'], () => {
    runSequence('build:ui');
});
gulp.task('build:ui', ['clean'], (cb) => {
    runSequence('build:ui:querytool', cb);
});

gulp.task('clean', [], () => del([BUILD_ROOT]));
gulp.task('default', () => GULP_PLUGINS.taskListing.withFilters(null, 'default')());

/* ********************************** */
/* Scorecards Targets                 */
/* ********************************** */
gulp.task('dev:ui',
    webpackDevServerTask(gulp, GULP_PLUGINS, {
        targetApp: BUILD_CONFIG.UI
    }));
gulp.task('build:ui:querytool',
    webpackBuildTask(gulp, GULP_PLUGINS, {
        targetApp: BUILD_CONFIG.UI
    }));

/* ********************************** */
/* API Server Targets                 */
/* ********************************** */
gulp.task('dev:server', ['server:start'],
    serverWatchTask(gulp, GULP_PLUGINS, {
        targetApp: BUILD_CONFIG.SERVER
    }));
gulp.task('server:start',
    serverStartTask(gulp, GULP_PLUGINS, {
        targetApp: BUILD_CONFIG.SERVER
    }));

import gutil   from 'gulp-util';
import notify  from 'gulp-notify';

const handleGulpError = function _handleGulpError(error) {
    const errorString = 'Gulp Error(' + error.plugin + '): ' + error.message;

    gutil.beep();
    notify(errorString);
    gutil.log(gutil.colors.white.bgRed.bold(errorString));
    // Have to emit 'end' to allow the task to continue on
    this.emit('end');
};

module.exports = handleGulpError;

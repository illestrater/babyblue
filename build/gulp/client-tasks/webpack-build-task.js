import webpack                from 'webpack';
import Promise                from 'bluebird';
import webpackConfigGenerator from '../utils/webpack-config-generator';

module.exports = function webpackBuildTask(gulp, gulpPlugins, options) {
    return function __startWebpackBuild() {
        return new Promise((resolve, reject) => {
            const config = webpackConfigGenerator.getConfig(options.targetApp.UI, true);

            webpack(config, (err, stats) => {
                if (err) {
                    reject(err);
                    throw new gulpPlugins.util.PluginError('webpack:build', err);
                }

                gulpPlugins.util.log('[webpack:build]', stats.toString({
                    colors: true
                }));
                resolve();
            });
        });
    };
};

import webpack                from 'webpack';
import WebpackDevServer       from 'webpack-dev-server';
import webpackConfigGenerator from '../utils/webpack-config-generator';

module.exports = function webpackDevTask(gulp, gulpPlugins, options) {
    return function __startWebpackDevServer() {
        global.isProd = false;
        gulpPlugins.util.log('[webpack:dev] Starting webpack-dev-server for: ', options.targetApp.NAME);

        const config = webpackConfigGenerator.getConfig(options.targetApp.UI, options.targetApp.UI.DEV_PORT);
        // See description here: http://webpack.github.io/docs/webpack-dev-server.html
        new WebpackDevServer(webpack(config), {
            historyApiFallback: true,
            hot:                true,
            inline:             true,
            quiet:              true,
            noInfo:             false,
            stats:              { colors: true },
            watchOptions:       {
                aggregateTimeout: 300,
                poll:             500
            }
        }).listen(options.targetApp.UI.DEV_PORT, '0.0.0.0', (err) => {
            if (err) throw new gulpPlugins.util.PluginError('webpack:dev', err);

            gulpPlugins.util.log('[webpack:dev]',
                `http://localhost:${options.targetApp.UI.DEV_PORT}/webpack-dev-server/index.html`);
        });
    };
};

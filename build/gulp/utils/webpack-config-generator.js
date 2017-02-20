const path              = require('path');
const webpack           = require('webpack');
const merge             = require('webpack-merge');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const REPOSITORY_ROOT    = path.resolve(__dirname, '../../../UI');
const NODE_MODULES_ROOT  = path.resolve(__dirname, '../../../node_modules');
const BUILD_ROOT         = path.resolve(__dirname, '../../../_dist');
const COMMON_APP_DIR     = path.resolve(__dirname, '../../../client/Common');
const SOURCE_INCLUDE_DIR = [COMMON_APP_DIR];
const UNITY_DIR          = [path.resolve(__dirname, '../../../unity')];

const SPLIT_VENDORS     =  [
    'angular',
    'angular-ui-router',
    'lodash',
    'moment',
];

const webpackConfigGenerator = module.exports = {};

// *****************************************************************************
// Common WebPack Configuration
// *****************************************************************************
function _getCommonConfig(targetApp) {
    SOURCE_INCLUDE_DIR.push(targetApp.APP_DIR);

    return {
        entry: {
            app:    [path.resolve(targetApp.ENTRY_FILE)],
            vendor: SPLIT_VENDORS
        },
        output: {
            path:     path.resolve(BUILD_ROOT, targetApp.BUILD_DIR_SUFFIX),
            filename: '[name].bundle.js',
        },
        resolve: {
            root:  REPOSITORY_ROOT,
            alias: {
                app:          targetApp.APP_DIR,
                node_modules: NODE_MODULES_ROOT
            },
            extensions: ['', '.js', '.scss', '.css', '.html', '.json']
        },
        module: {
            loaders: [
                {
                    test:    /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader:  'url-loader?limit=10000&mimetype=application/font-woff',
                    include: SOURCE_INCLUDE_DIR
                },
                {
                    test:    /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader:  'file-loader',
                    include: SOURCE_INCLUDE_DIR
                },
                {
                    test:    /\.(js)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loaders: ['ng-annotate', 'babel-loader'],
                    include: SOURCE_INCLUDE_DIR
                },
                {
                    test:    /\.html$/,
                    exclude: [
                        path.resolve(__dirname, `${targetApp.APP_DIR}/index.html`)
                    ],
                    loader:  `ngtemplate?relativeTo=${targetApp.APP_DIR}/!html`,
                    include: SOURCE_INCLUDE_DIR
                },
                {
                    test:    /\.json?$/,
                    loaders: ['json'],
                    include: SOURCE_INCLUDE_DIR
                },
                {
                    test:    /\.(png|jpg)$/,
                    loader:  'url-loader?limit=8192',
                    include: SOURCE_INCLUDE_DIR
                }
            ]
        },
        plugins: [
            new HtmlwebpackPlugin({
                title:    targetApp.DOC_TITLE,
                template: `${targetApp.APP_DIR}/index.html`,
                inject:   'body'
            }),
            new CopyWebpackPlugin([
                { from: `${targetApp.APP_DIR}/assets/images/favicon.ico`, to: 'favicon.ico' },
            ]),
            new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
            // NOTE: Disables regex in dynamic requires, used to exclude all the
            // momentjs requires for locales ( not needed ). If 'odd' issues creep up in
            // builds surrounding dates, or internationlization then look here
            new webpack.ContextReplacementPlugin(/.*$/, /NEVER_MATCH^/),
            new webpack.HotModuleReplacementPlugin()
        ]
    };
}

// *****************************************************************************
// Development WebPack Configuration, needs to be merged with the common config
// *****************************************************************************
function _getDevelopmentConfig(targetApp, devPort) {
    // noinspection JSUnresolvedFunction
    return {
        devtool: 'source-map',
        module:  {
            preLoaders: [
                {
                    test:    /\.js?$/,
                    loaders: ['eslint'],
                    include: targetApp.APP_DIR
                }
            ],
            loaders: [{
                test:    /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test:    /\.scss$/,
                loaders: [
                    'style', 'css', 'autoprefixer-loader',
                    'resolve-url', 'sass'
                ],
                exclude: [NODE_MODULES_ROOT]
            }]
        },
        devServer: {
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
        },
        plugins: [
            new webpack.DefinePlugin({
                '__IS_DEV_ENV__': true,
                'process.env':    {
                    NODE_ENV: JSON.stringify('development')
                }
            })
        ]
    };
}

// *****************************************************************************
// Development WebPack Configuration, needs to be merged with the common config
// *****************************************************************************
function _getProductionConfig(targetApp) {
    // noinspection JSUnresolvedFunction
    return {
        devtool: 'source-map',
        module:  {
            loaders: [
                {
                    test:    /\.css$/,
                    loaders: ['style', 'css']
                },
                {
                    test:   /\.scss$/,
                    loader: ExtractTextPlugin.extract('style',
                        'css-loader!autoprefixer-loader!resolve-url-loader!sass-loader'),
                    exclude: [NODE_MODULES_ROOT]
                }
            ]
        },
        plugins: [
            new webpack.NoErrorsPlugin(),
            new ExtractTextPlugin('[name].css'),
            new webpack.ProgressPlugin((percentage, msg) => {
                console.log(`Percent: ${percentage * 100} - ${msg}`);
            }),
            new webpack.DefinePlugin({
                '__IS_DEV_ENV__': false,
                'process.env':    {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.DedupePlugin()
        ]
    };
}

webpackConfigGenerator.getConfig = function _getConfig(targetApp, isProdOrPort) {
    let isProd = false;
    let devPort, targetAppEnvironmentConfig;

    // If a number was passed use for inclusion of HMR
    if (typeof isProdOrPort === 'number' || !isProdOrPort) {
        devPort = isProdOrPort || 5000;
        isProd = false;
    } else {
        isProd = true;
    }

    const targetAppCommonConfig = _getCommonConfig(targetApp);

    if (isProd) {
        targetAppEnvironmentConfig = _getProductionConfig(targetApp);
    } else {
        targetAppCommonConfig.entry.app.unshift(`webpack-dev-server/client?http://0.0.0.0:${devPort}`,
            'webpack/hot/dev-server');
        targetAppEnvironmentConfig = _getDevelopmentConfig(targetApp, devPort);
    }
    const mergedConfig = merge(targetAppCommonConfig, targetAppEnvironmentConfig);
    return mergedConfig;
};

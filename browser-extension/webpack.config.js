const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const ManifestVersionSyncPlugin = require('webpack-manifest-version-sync-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        popup: ['core-js/stable', 'regenerator-runtime/runtime', './src/popup.js'],
        content: ['core-js/stable', 'regenerator-runtime/runtime', './src/content.js'],
        devtools: ['core-js/stable', 'regenerator-runtime/runtime', './src/devtools.js'],
        background: ['core-js/stable', 'regenerator-runtime/runtime', './src/background.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    plugins: [
        new HTMLPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
        }),
        new HTMLPlugin({
            chunks: ['devtools'],
            filename: 'devtools.html',
        }),
        new CopyPlugin([
            { from: './src/assets', to: './assets' },
            { from: './src/manifest.json', to: './manifest.json' },
        ]),
        new ManifestVersionSyncPlugin(),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
    },
    stats: 'minimal',
};

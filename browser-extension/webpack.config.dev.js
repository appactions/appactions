const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const ManifestVersionSyncPlugin = require('webpack-manifest-version-sync-plugin');

module.exports = {
    mode: 'development',
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
            showErrors: true,
        }),
        new HTMLPlugin({
            chunks: ['devtools'],
            filename: 'devtools.html',
            showErrors: true,
        }),
        new CopyPlugin([
            { from: './src/assets', to: './assets' },
            { from: './src/manifest.json', to: './manifest.json' },
        ]),
        new ExtensionReloader({
            reloadPage: false,
            entries: {
                contentScript: ['content', 'devtools'],
                background: 'background',
                extensionPage: ['popup'],
            },
        }),
        new ManifestVersionSyncPlugin(),
    ],
    stats: 'minimal',
};

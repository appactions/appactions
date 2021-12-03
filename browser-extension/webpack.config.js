const HTMLPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const ManifestVersionSyncPlugin = require('webpack-manifest-version-sync-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        main: './src/main.js',
        content: './src/content.js',
        background: './src/background.js',
        panel: './src/panel.js',
        popup: './src/popup.js',
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
            chunks: ['main'],
            filename: 'main.html',
            showErrors: true,
        }),
        new HTMLPlugin({
            chunks: ['panel'],
            filename: 'panel.html',
            showErrors: true,
        }),
        new CspHtmlWebpackPlugin({
            "default-src": "'self'",
            "script-src": "'self'",
            "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src": "'self' https://fonts.gstatic.com",
            "img-src": "'self' data:",
        }),
        new CopyPlugin([
            { from: './src/assets', to: './assets' },
            { from: './src/manifest.json', to: './manifest.json' },
        ]),
        new ExtensionReloader({
            reloadPage: false,
            entries: {
                contentScript: ['content', 'main'],
                background: 'background',
                extensionPage: ['popup'],
            },
        }),
        new ManifestVersionSyncPlugin(),
    ],
    devtool: 'cheap-module-source-map',
    optimization: process.env.NODE_ENV === 'production' ? {
        minimize: true,
    } : undefined,
    stats: 'minimal',
};

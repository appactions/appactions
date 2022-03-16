const HTMLPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');

const extensionConfig = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        main: './src/browser-extension/main.js',
        content: './src/browser-extension/content.js',
        background: './src/browser-extension/background.js',
        panel: './src/browser-extension/panel.js',
        popup: './src/browser-extension/popup.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build/browser-extension'),
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
            'default-src': "'self'",
            'script-src': "'self'",
            'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
            'font-src': "'self' https://fonts.gstatic.com",
            'img-src': "'self' data:",
        }),
        // TODO make the copy plugin to set the version in manifest.json based on package.json
        new CopyPlugin({
            patterns: [
                { from: './src/browser-extension/assets', to: './assets' },
                { from: './src/browser-extension/manifest.json', to: './manifest.json' },
            ],
        }),
        process.env.NODE_ENV === 'development'
            ? new ExtensionReloader({
                  reloadPage: false,
                  entries: {
                      contentScript: ['content', 'main'],
                      background: 'background',
                      extensionPage: ['popup'],
                  },
              })
            : null,
    ].filter(Boolean),
    devtool: 'cheap-module-source-map',
    optimization:
        process.env.NODE_ENV === 'production'
            ? {
                  minimize: true,
              }
            : undefined,
    stats: 'minimal',
};

const assertMenuConfig = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        assertMenu: './src/browser-extension/assert-menu.js',
    },
    output: {
        path: path.resolve(__dirname, 'build/browser-extension'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
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
    devtool: 'cheap-module-source-map',
    optimization:
        process.env.NODE_ENV === 'production'
            ? {
                  minimize: true,
              }
            : undefined,
    stats: 'minimal',
};

module.exports = [extensionConfig, assertMenuConfig];

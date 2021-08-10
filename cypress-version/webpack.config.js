const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

process.env.NODE_ENV = 'development';

const config = {
    mode: 'development',
    devtool: false,
    entry: {
        app: './cypress/app/index.js',
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]___[hash:base64:5]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './cypress/app/index.html',
        }),
    ],
    devServer: {
        port: 12000,
        clientLogLevel: 'warning',
        publicPath: '/',
        stats: 'errors-only',
        historyApiFallback: true,
    },
};

module.exports = config;

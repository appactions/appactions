const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

process.env.NODE_ENV = 'development';

const config = {
    mode: 'development',
    devtool: false,
    entry: {
        app: resolve(__dirname, './index.js'),
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'build'),
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
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, './index.html'),
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

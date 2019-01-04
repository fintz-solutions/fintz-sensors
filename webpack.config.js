const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "production",
    entry: './src/static/js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        alias: {
            $: "jquery/src/jquery",
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [path.resolve(__dirname, "./src/static")],
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/views/landing.html.tpl',
            filename: './index.html'
        })
    ]
};
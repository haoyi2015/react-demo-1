﻿// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const config = {
    // 入口文件
    entry: {
        app: './src/app.js',
        list: './src/list.js'
    },
    // 出口文件
    output: {
        path: __dirname + '/dist',
        // 文件名，将打包好的导出为bundle.js
        filename: '[name].[hash].js'
    },
    // webpack-dev-server
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        // loader放在rules这个数组里面
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 写法一
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            minimize: true,
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    // 将插件添加到webpack中
    // 如果还有其他插件，将两个数组合到一起就行了
    plugins: [
        // html 源文件
        new HtmlWebpackPlugin({
            filename: `./app.html`,
            chunks: ['app'],
            template: `./index.html`
        }),
        new HtmlWebpackPlugin({
            filename: `./list.html`,
            chunks: ['list'],
            template: `./index.html`
        }),
        // HMR 需要的两个插件
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        // 省略后缀名
        extensions: ['.js']
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};

if (process.env.npm_lifecycle_event === 'build') {
    console.log('building..............');
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor']
        }),
        new UglifyJSPlugin()
    ]);
}

module.exports = config;
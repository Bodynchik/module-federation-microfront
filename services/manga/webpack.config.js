const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ModuleFederationPlugin } = require('webpack').container;
const packageDependencies = require('./package.json');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'js/bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: "http://localhost:3002/"
    },
    devtool: 'inline-source-map',
    plugins: [
        new MiniCssExtractPlugin({filename: 'css/[name].[contenthash].css'}),
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new ModuleFederationPlugin(
            {
                name: 'manga',
                filename: 'remoteEntry.js',
                exposes: {
                    './Manga': './src/components/pages/pages.js'
                },
                shared: {
                    ...packageDependencies.dependencies,
                    react: {
                        eager: true,
                        requiredVersion: packageDependencies.dependencies['react']
                    },
                    'react-dom': {
                        eager: true,
                        requiredVersion: packageDependencies.dependencies['react-dom']
                    },
                    'react-router-dom': {
                        eager: true,
                        requiredVersion: packageDependencies.dependencies['react-router-dom']
                    }
                }
            })
    ],
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", ["@babel/preset-react", { "runtime": "automatic" }]]
                    }
                }
            }
        ]
    },
    devServer: {
        port: 3002,
        open: true,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true
    }
};
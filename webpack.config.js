const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const path = require('path');
const {
    NODE_ENV = 'production',
} = process.env;
module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@core': path.resolve(__dirname, './src/core')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./src/config"),
                    to: path.resolve(__dirname, "./build/config")
                },
                {
                    from: path.resolve(__dirname, "./src/static"),
                    to: path.resolve(__dirname, "./build/static")
                },
                {
                    from: path.resolve(__dirname, "./src/tmp"),
                    to: path.resolve(__dirname, "./build/tmp")
                }
            ],
        }),
    ],
    externals: [ nodeExternals() ]
}

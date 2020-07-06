const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');
const packageJson = require('../package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils');

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: utils.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.sass', '.scss' ],
    alias: {
      '@': utils.resolve('src')
    }
  },
  plugins: [
    new WebpackBarPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: packageJson.name,
      inject: true,
      template: path.resolve(__dirname, utils.resolve('src'), 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css'
    })
  ]
}
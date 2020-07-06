const path = require('path')
const webpack = require('webpack');
const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.common')

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    stats: 'errors-only',
  }
})
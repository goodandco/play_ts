const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
      loaders: [
          { test: /\.tsx?$/, loader: "ts-loader" }
      ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000,
    hot:true
  }
};

module.exports = config;

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// !!! MODULE FEDERATION: Common library's publicPath
// This library is consumed by both host and remotes
const publicPath = process.env.PUBLIC_PATH || (isProduction ? '/mf-with-webpack/lk-common-lib/' : 'http://localhost:8082/');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './lk-common-lib/src/demo.ts',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/lk-common-lib'),
    filename: 'bundle.js',
    publicPath: publicPath,
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/lk-common-lib')
    },
    port: 8082,
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: isProduction ? {
    minimize: true,
    splitChunks: {
      chunks: 'async'
    }
  } : {},
  plugins: [
    // !!! MODULE FEDERATION PLUGIN - Common Library Configuration
    new ModuleFederationPlugin({
      // !!! NAME: Shared library name used by all consumers
      name: 'commonLib',
      
      // !!! FILENAME: Entry point for the common library
      filename: 'remoteEntry.js',
      
      // !!! EXPOSES: Multiple modules exposed by the common library
      // This demonstrates how a single remote can expose multiple entry points
      // Consumers can import specific modules or everything via './index'
      exposes: {
        './utils': './lk-common-lib/src/utils.ts',           // Utility functions
        './constants': './lk-common-lib/src/constants.ts',   // Shared constants
        './types': './lk-common-lib/src/types.ts',           // TypeScript types
        './index': './lk-common-lib/src/index.ts'            // Everything combined
      },
      
      // !!! SHARED: Common library doesn't consume other remotes
      // But if it had dependencies, they would be shared here
      shared: {}
    }),
    new HtmlWebpackPlugin({
      template: './lk-common-lib/index.html'
    })
  ]
};


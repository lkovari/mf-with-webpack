const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// !!! MODULE FEDERATION: Remote-A also consumes the common library
const commonLibUrl = process.env.COMMON_LIB_URL || 'http://localhost:8082';

// !!! MODULE FEDERATION: publicPath for Remote-A's own assets
const publicPath = process.env.PUBLIC_PATH || (isProduction ? '/mf-with-webpack/remote-a/' : 'http://localhost:8081/');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './remote-a/src/remote.ts',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/remote-a'),
    filename: 'bundle.js',
    publicPath: publicPath,
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/remote-a')
    },
    port: 8081,
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
    // !!! MODULE FEDERATION PLUGIN - Remote-A Configuration
    new ModuleFederationPlugin({
      // !!! NAME: Must match the name used in host's remotes configuration
      name: 'remoteApp',
      
      // !!! FILENAME: The entry point file that webpack generates
      // The host will fetch this file to load the remote
      filename: 'remoteEntry.js',
      
      // !!! REMOTES: Remote-A can also consume other remotes (like common library)
      // This demonstrates bi-directional federation
      remotes: {
        commonLib: `commonLib@${commonLibUrl}/remoteEntry.js`
      },
      
      // !!! EXPOSES: Define which modules this remote makes available to the host
      // Format: './exposedName': './path/to/module'
      // - exposedName: How the host imports it (import('remoteApp/remoteApi'))
      // - path: The actual module file in this project
      exposes: {
        './remoteApi': './remote-a/src/remote.ts'
      },
      
      // !!! SHARED: Dependencies shared with host and other remotes
      shared: {
        // Empty for now - add shared dependencies here as needed
      }
    }),
    new HtmlWebpackPlugin({
      template: './remote-a/index.html'
    })
  ]
};

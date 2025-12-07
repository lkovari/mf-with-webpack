const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

// Environment configuration for different deployment scenarios
const isProduction = process.env.NODE_ENV === 'production';

// !!! MODULE FEDERATION: Remote URLs can be configured via environment variables
// This allows the host to connect to different remote locations in dev/staging/prod
const remoteAUrl = process.env.REMOTE_A_URL || 'http://localhost:8081';
const remoteBUrl = process.env.REMOTE_B_URL || 'http://localhost:8083';
const commonLibUrl = process.env.COMMON_LIB_URL || 'http://localhost:8082';

// !!! MODULE FEDERATION: publicPath must be set correctly for the host to serve its own assets
// In development, use full URL; in production, use GitHub Pages path
const publicPath = process.env.PUBLIC_PATH || (isProduction ? '/mf-with-webpack/host/' : 'http://localhost:8080/');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './host/src/index.ts',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/host'),
    filename: 'bundle.js',
    publicPath: publicPath,
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/host')
    },
    port: 8080,
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
    // !!! MODULE FEDERATION PLUGIN - This is the core of Module Federation
    new ModuleFederationPlugin({
      // !!! NAME: Unique identifier for this federated module (the HOST)
      name: 'host',
      
      // !!! REMOTES: Define which remote modules this host can consume
      // Format: localName: 'remoteName@remoteUrl/remoteEntry.js'
      // - localName: How you import it in code (e.g., import('remoteApp/...'))
      // - remoteName: The 'name' defined in the remote's ModuleFederationPlugin
      // - remoteUrl: Where the remote is hosted
      // - remoteEntry.js: The entry point file that webpack generates for the remote
      remotes: {
        remoteApp: `remoteApp@${remoteAUrl}/remoteEntry.js`,      // Remote-A application
        remoteBApp: `remoteBApp@${remoteBUrl}/remoteEntry.js`,    // Remote-B application
        commonLib: `commonLib@${commonLibUrl}/remoteEntry.js`     // Shared common library
      },
      
      // !!! SHARED: Define dependencies shared between host and remotes
      // This prevents loading the same library multiple times
      // Example: shared: { 'react': { singleton: true, requiredVersion: '^18.0.0' } }
      shared: {
        // Empty for now - add shared dependencies here as needed
      }
    }),
    new HtmlWebpackPlugin({
      template: './host/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'README.md',
          to: 'README.md'
        }
      ]
    })
  ]
};

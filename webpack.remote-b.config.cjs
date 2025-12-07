const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// !!! MODULE FEDERATION: Remote-B also consumes the common library
const commonLibUrl = process.env.COMMON_LIB_URL || 'http://localhost:8082';

// !!! MODULE FEDERATION: publicPath for Remote-B's own assets (different port from Remote-A)
const publicPath = process.env.PUBLIC_PATH || (isProduction ? '/mf-with-webpack/remote-b/' : 'http://localhost:8083/');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './remote-b/src/remote.ts',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/remote-b'),
    filename: 'bundle.js',
    publicPath: publicPath,
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/remote-b')
    },
    port: 8083,
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
    // !!! MODULE FEDERATION PLUGIN - Remote-B Configuration
    new ModuleFederationPlugin({
      // !!! NAME: Unique name for Remote-B (must match host's configuration)
      name: 'remoteBApp',
      
      // !!! FILENAME: Entry point for module federation
      filename: 'remoteEntry.js',
      
      // !!! REMOTES: Remote-B consumes the common library
      remotes: {
        commonLib: `commonLib@${commonLibUrl}/remoteEntry.js`
      },
      
      // !!! EXPOSES: What Remote-B makes available to the host
      // Note: Different from Remote-A's './remoteApi' to demonstrate multiple remotes
      exposes: {
        './remoteContent': './remote-b/src/remote.ts'
      },
      
      // !!! SHARED: Dependencies shared with host and other remotes
      shared: {
        // Empty for now - add shared dependencies here as needed
      }
    }),
    new HtmlWebpackPlugin({
      template: './remote-b/index.html'
    })
  ]
};


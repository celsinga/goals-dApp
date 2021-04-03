const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /(\.tsx|\.ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              },
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      features: {
                        'nesting-rules': true
                      },
                    }
                  ]
                ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    fallback: {
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('stream-http'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
    },
  },
  plugins: [
    
    new webpack.DefinePlugin({
      'ENV_TYPE': JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/favicon.ico' }
      ]
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      publicPath: '/'
    })
  ],
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

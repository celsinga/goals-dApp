const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env', {}]
                ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
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
        { from: 'public' }
      ]
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

module.exports = (env, options) => {
  const isDevelopment = options.mode === 'development';
  const result = {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /(\.tsx|\.ts)$/, use: [
            {
              loader: 'ts-loader',
              options: {
                getCustomTransformers: () => ({
                  before: isDevelopment ? [ReactRefreshTypeScript()] : [],
                })
              }
            }
          ],
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
        assert: require.resolve('assert/')
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'ENV_TYPE': JSON.stringify(options.mode),
        'USE_GIVEN_PROVIDER': JSON.stringify(env.use_given_provider),
        'USE_HASH_ROUTER': JSON.stringify(env.use_hash_router)
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
      hot: true,
      historyApiFallback: true
    },
    optimization: {},
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
  if (isDevelopment) result.plugins.push(new ReactRefreshWebpackPlugin());
  return result;
};

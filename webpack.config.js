const { resolve } = require('path')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    app: resolve(__dirname, 'src')
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  target: 'web',
  devtool: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    modules: false
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: 'app.[contenthash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
    }),
    new HtmlPlugin({
      template: resolve(__dirname, 'src', 'index.html'),
      inject: false,
      minify: true
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        canPrint: false,
        assetNameRegExp: /\.css$/,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        }
      }),
      new TerserPlugin({
        parallel: true,
        extractComments: true
      })
    ]
  }
}

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GettextHtmlPlugin = require('gettext-html-plugin')

module.exports = {
  entry: {
    index: './index.js'
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    publicPath: '/'
  },

  devServer: {
    clientLogLevel: 'warning',
    inline: true,
    progress: true,
    hot: true,
    contentBase: __dirname,
    watchContentBase: true,
    host: '127.0.0.1',
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: false
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'zh-cn.html',
      template: __dirname + '/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'jp.html',
      template: __dirname + '/index.html',
      chunks: ['index']
    }),
    new GettextHtmlPlugin({
      langsPath: __dirname + '/langs',
      sources: {
        'zh-cn.html': 'zh_CN',
        'jp.html': 'jp'
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
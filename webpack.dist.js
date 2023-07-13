var webpack = require('webpack')
const path = require('path')
module.exports = {
  entry: './packages/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/lib/',
    filename: 't-mobile-form',
    library: ['TMobileForm'],
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/lib/vue.common.js'
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.json$/,
      //   loader: 'json'
      // },
      // {
      //   test: /\.html$/,
      //   loader: 'vue-html'
      // },
      // {
      //   test: /\.scss$/,
      //   loader: 'sass-loader'
      // },
      {
        test: /\.css$/,
        loader: 'style!css!postcss!scss'
      }
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loaders: ['url?limit=1000']
      // }
    ]
  }
}
module.exports.output.filename = 't-mobile-form.min.js'
module.exports.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    compress: {
      warnings: false
    }
  })
]

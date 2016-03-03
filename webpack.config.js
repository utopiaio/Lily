var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: 'build/',
    filename: 'bundle.js'
  },
  postcss: function() {
    return [autoprefixer, precss];
  },
  module: {
    loaders: [
      // css
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      // less
      { test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less-loader' },

      // image
      { test: /\.(jpg|png|gif)$/, loader: 'file-loader?name=static/[name].[ext]'},

      // this is where all non web-pack / global stuff are loaded
      { test: /(trix)\.js$/, exclude: /app/, loader: 'script-loader'},

      // fonts
      { test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=static/[name].[ext]' },

      // babel
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'app')},

      // vue
      { test: /\.vue$/, loader: 'vue-loader' }
    ]
  }
};

// depending on the arugments passes we'll be adding specific
// plugins to webpack else we'll have production build even on webpack dev server
if (process.argv.indexOf('-p') > -1) {
  module.exports.devtool = '#source-map';
  module.exports.plugins = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ];
} else {
  module.exports.plugins = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ];
}

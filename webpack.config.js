var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      // css
      { test: /\.css$/, loader: 'style-loader!css' },

      // less
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },

      // image
      { test: /\.(jpg|png|gif)$/, loader: 'file-loader?name=assets/[name].[ext]'},

      // this is where all non web-pack / global stuff are loaded
      { test: /(trix)\.js$/, exclude: /app/, loader: 'script-loader'},

      // fonts
      { test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=assets/[name].[ext]' },

      // babel
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },

      // vue
      { test: /\.vue$/, loader: 'vue-loader' }

    ]
  }
};

// I'm missing something, NODE_ENV=procution throws error. So I'm working around
// it; for now, to issue a production webpack bundle
// $ node_modules/.bin/webpack --production
if(process.argv.indexOf('--production') > -1) {
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

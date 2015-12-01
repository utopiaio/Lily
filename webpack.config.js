var webpack = require('webpack');

module.exports = {
  entry: './app.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      // css
      { test: /\.css$/, loader: 'style!css' },

      // font (bootstrap, font-awesome)
      { test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=./app/dist/[name].[ext]' },

      // image
      { test: /\.(jp(e)?g)|png/, loader: 'file-loader?name=./app/dist/[name].[ext]'},

      // less
      { test: /\.less$/, loader: 'style!css!less' },

      // vue
      { test: /\.vue$/, loader: 'vue' },

      // babel
      { test: /\.babel$/, loader: 'babel', query: { presets: ['es2015'] } }
    ]
  }
};

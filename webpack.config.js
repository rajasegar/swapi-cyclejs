const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    open: true
  },
  plugins:[
    new HtmlWebpackPlugin({ title: 'Output management' })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": ['@babel/preset-env'],
            "plugins": [
              "@babel/plugin-syntax-jsx",
              ["transform-react-jsx", { "pragma": "Snabbdom.createElement"}]
            ]
          }
        }
      }
    ]
  }
};


const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/cliente/js/index.js',
    program: './src/cliente/js/program.js', // Agrega la entrada para program.js
    simulador: './src/cliente/js/simulador.js', // Agrega la entrada para program.js
    simulaDeuda: './src/cliente/js/simulaDeuda.js', // Agrega la entrada para program.js
    pagar: './src/cliente/js/pagar.js', // Agrega la entrada para program.js
    convenio: './src/cliente/js/convenio.js' // Agrega la entrada para program.js
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/cliente/index.html',
      chunks: ['index'], // Incluye solo el chunk index en index.html
      filename: 'index.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/program.html',
      chunks: ['program'], // Incluye solo el chunk program en program.html
      filename: 'program.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/simulador.html',
      chunks: ['simulador'], // Incluye solo el chunk program en simulador.html
      filename: 'simulador.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/simulaDeuda.html',
      chunks: ['simulaDeuda'], // Incluye solo el chunk program en simulaDeuda.html
      filename: 'simulaDeuda.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/pagar.html',
      chunks: ['pagar'], // Incluye solo el chunk program en simulaDeuda.html
      filename: 'pagar.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/convenio.html',
      chunks: ['convenio'], // Incluye solo el chunk program en simulaDeuda.html
      filename: 'convenio.html'
    })
  ]
};
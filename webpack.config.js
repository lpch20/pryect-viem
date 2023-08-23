const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/cliente/js/index.js',
    program: './src/cliente/js/program.js', 
    simulaDeuda: './src/cliente/js/simulaDeuda.js', 
    pagar: './src/cliente/js/pagar.js', 
    convenio: './src/cliente/js/convenio.js',
    simulaDeuda2: './src/cliente/js/simulaDeuda2.js',
    pagoContado: './src/cliente/js/pagoContado.js',
    abitab: './src/cliente/js/abitabRedpagos.js',
    redpagos: './src/cliente/js/abitabRedpagos.js',
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
      chunks: ['index'], 
      filename: 'index.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/program.html',
      chunks: ['program'], 
      filename: 'program.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/simulaDeuda.html',
      chunks: ['simulaDeuda'], 
      filename: 'simulaDeuda.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/simulaDeuda2.html',
      chunks: ['simulaDeuda2'], 
      filename: 'simulaDeuda2.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/pagar.html',
      chunks: ['pagar'], 
      filename: 'pagar.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/convenio.html',
      chunks: ['convenio'], 
      filename: 'convenio.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/pagoContado.html',
      chunks: ['pagoContado'], 
      filename: 'pagoContado.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/abitab.html',
      chunks: ['abitab'], 
      filename: 'abitab.html'
    }),
    new htmlWebpackPlugin({
      template: './src/cliente/redpagos.html',
      chunks: ['redpagos'], 
      filename: 'redpagos.html'
    })
  ]
};
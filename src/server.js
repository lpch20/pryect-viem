const express = require('express');
const webpack = require('webpack');
const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const app = express();

const port = process.env.PORT || 5000;

app.use('/static', express.static('dist'));
app.use(webpackDevMiddleware(webpack(webpackConfig)));

app.get('/redireccionar', function(req, res) {
  res.redirect('/simulador.html');
});

app.get('/redireccionar2', function(req, res) {
  res.redirect('/convenio.html');
});

// Ruta para la página simulador.html
app.get('/simulador', (req, res) => {
  res.sendFile(__dirname + '/simulador.html');
});

app.get('/convenio', (req, res) => {
  res.sendFile(__dirname + '/convenio.html');
});

app.get('/simulaDeuda', (req, res) => {
  res.sendFile(__dirname + '/simulaDeuda.html');
});

app.get('/pagar', (req, res) => {
  res.sendFile(__dirname + '/pagar.html');
});

// Ruta para la página program.html
app.get('/program', (req, res) => {
  res.sendFile(__dirname + '/program.html');
});

// Ruta de la página principal
app.get('/', (req, res) => {
  res.send('/index.html');
});

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});


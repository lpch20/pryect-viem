const express = require('express');
const webpack = require('webpack');
const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const fetch = require('node-fetch')
const app = express();
const mysql = require('mysql')
const axios = require('axios');
const bodyParser = require('body-parser');
const mercadopago = require("mercadopago");
const btoa = require('btoa');

const port = process.env.PORT || 5000;

app.use('/static', express.static('dist'));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.json());


app.get('/redireccionar2', function (req, res) {
  res.redirect('/convenio.html');
});

app.get('/redireccionar', function (req, res) {
  res.redirect('/simulaDeuda2.html');
});

app.get('/convenio', (req, res) => {
  res.sendFile(__dirname + '/convenio.html');
});
app.get('/simulaDeuda2', (req, res) => {
  res.sendFile(__dirname + '/simulaDeuda2.html');
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de la página principal
app.get('/abitab', (req, res) => {
  res.send('/abitab.html');
});
// Ruta de la página principal
app.get('/redpagos', (req, res) => {
  res.send('/redpagos.html');
});

let conexion = mysql.createConnection({
  host: 'localhost',
  database: 'viem_clientes',
  user: 'root',
  password: ''
})

conexion.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log('CONEXION EXITOSA')
  }
});

conexion.connect(function (error) {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});


// Endpoint para recibir la solicitud del cliente y realizar la consulta a la base de datos
app.get('/buscar-cedula/:cedula', function (req, res) {
  const cedula = req.params.cedula;

  const query = `SELECT * FROM viem_clientes WHERE cedula = '${cedula}'`;

  conexion.query(query, function (error, resultados) {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      if (resultados.length > 0) {
        const nombre = resultados[0].Nombre;
        console.log('Nombre:', nombre);
        res.json({ nombre });
      } else {
        res.json({ nombre: '' });
      }
    }
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint para enviar el token
app.post('/enviar-token', (req, res) => {
  let { celular } = req.body;

  let tokenEnviado = {};

  // Verificar si el número de teléfono tiene el código de país "+598" o "598"
  if (!celular.startsWith("+598") && !celular.startsWith("598")) {
    // Si no tiene el código de país, agregarlo al principio
    celular = "+598" + celular;
  }

  // Verificar expresión regular del número de celular
  const regexCelular = /^[0-9+]{8,12}$/;
  if (celular === "") {
    // swal.fire("Error", "Por favor, ingresa un número de celular válido.", "error");
  } else {
    let codigo = Math.floor(100000 + Math.random() * 900000);
    // Almacenar el token enviado para el número de celular correspondiente
    tokenEnviado[celular] = codigo;

    // Realizar solicitud a la API de Twilio para enviar el token al número de celular
    fetch('https://api.twilio.com/2010-04-01/Accounts/ACa297d1483906a3dd59cb4674fcfcce00/Messages.json', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa("ACa297d1483906a3dd59cb4674fcfcce00:1d8b3e9bde549850410fecc58d4be222")
      },
      body: new URLSearchParams({
        From: "+14175573063",
        To: celular,
        Body: "Tu token es: " + codigo
      })
    })
      .then(response => {
        if (response.ok) {
          // Envía una respuesta de éxito al cliente junto con el token y el número de celular
          res.status(200).json({ message: "Se ha enviado el token al número de celular proporcionado.", token: codigo, celular });
        } else {
          throw new Error("Error en la solicitud");
        }
      })
      .catch(error => {
        // Envía una respuesta de error al cliente
        res.status(500).json({ error: "Ocurrió un error al enviar el token. Por favor, intenta nuevamente más tarde." });
        console.error(error);
      });
  }
});


app.get('/buscar-deuda/:cedula', function (req, res) {
  const cedula = req.params.cedula;

  const query = `SELECT Nombre, contado, financiar, cartera, entrega FROM viem_clientes WHERE cedula = '${cedula}'`;

  conexion.query(query, function (error, resultados) {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      if (resultados.length > 0) {
        const nombre = resultados[0].Nombre; // Obtener el nombre desde los resultados
        const contadoCreditel = resultados.find(resultado => resultado.cartera === 'CREDITEL')?.contado;
        const financiarCreditel = resultados.find(resultado => resultado.cartera === 'CREDITEL')?.financiar;
        const contadoCdc = resultados.find(resultado => resultado.cartera === 'CREDITO DE LA CASA')?.contado;
        const financiarCdc = resultados.find(resultado => resultado.cartera === 'CREDITO DE LA CASA')?.financiar;

        let entrega = null;
        if (resultados[0].entrega) {
          entrega = JSON.parse(resultados[0].entrega);
        }

        if ((contadoCreditel && financiarCreditel) || (contadoCdc && financiarCdc)) {
          const carteras = resultados.map(resultado => resultado.cartera);
          res.json({ nombre, contadoCreditel, financiarCreditel, contadoCdc, financiarCdc, entrega, carteras });
        } else {
          res.json({ nombre, contadoCreditel: null, financiarCreditel: null, contadoCdc: null, financiarCdc: null, entrega, carteras: [] });
        }
      } else {
        res.json({ nombre: null, contadoCreditel: null, financiarCreditel: null, contadoCdc: null, financiarCdc: null, entrega: null, carteras: [] });
      }
    }
  });

});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos: ', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

app.use(express.json());

app.post('/api/saveData/', (req, res) => {
  const { cedula, nombre, fechaNacimiento, celular, fechaIngreso } = req.body;

  // Realiza la lógica de inserción en la base de datos SQL
  const sql = "INSERT INTO login (cedula, nombre, fechaNacimiento, celular, fechaIngreso) VALUES (?, ?, ?, ?, ?)";
  connection.query(sql, [cedula, nombre, fechaNacimiento, celular, fechaIngreso], (error, results, fields) => {
    if (error) {
      console.error('Error al insertar los datos en la base de datos: ', error);
      return res.status(500).json({ message: 'Error al guardar los datos en la base de datos' });
    }
    console.log('Datos guardados en la base de datos');
    res.status(200).json({ message: 'Datos guardados correctamente' });
  });
});

const connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'convenios'
});

connect.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos: ', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

app.use(express.json());

app.post('/api/convenios/', (req, res) => {
  const { cedula, entrega, cuotasPagas, cuotasTotal, montoInicial, montoRestante } = req.body;

  // Realiza la lógica de inserción en la base de datos SQL
  const sqlt = "INSERT INTO convenios (cedula, entrega, cuotasPagas, cuotasTotal, montoInicial, montoRestante) VALUES (?, ?, ?, ?, ?, ?)";
  connect.query(sqlt, [cedula, entrega, cuotasPagas, cuotasTotal, montoInicial, montoRestante], (error, results, fields) => {
    if (error) {
      console.error('Error al insertar los datos en la base de datos: ', error);
      return res.status(500).json({ message: 'Error al guardar los datos en la base de datos' });
    }
    console.log('Datos guardados en la base de datos');
    res.status(200).json({ message: 'Datos guardados correctamente' });
  });
});

const conntacion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datos_simulador'
});

conntacion.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos: ', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});


// Función para calcular cuota con interés
function calcularCuotaConInteres(capital, tasaInteres, numCuotas) {
  tasaInteres = tasaInteres / 100;
  return capital / ((1 - Math.pow(1 + tasaInteres, -numCuotas)) / tasaInteres);
}



app.get('/amount-slider-min', (req, res) => {
  // Calcular el valor máximo para el slider amountSlider
  const minimo = 0;

  // Enviar el valor máximo como respuesta JSON
  console.log(maxAmount)
  res.json({ minimo });
});


app.post('/calcular', async (req, res) => {
  const selectedOption = req.body.selectedOption;
  const montoPorCuota = req.body.montoPorCuota;
  const amount2Value = req.body.amount2Value;


  let cuotaConInteres = 0;
  let restoEntreEntregaYMonto = 0;
  let montorestanteSoloentrega = 0;


  if (amount2Value > 0) {
    restoEntreEntregaYMonto = montoPorCuota - amount2Value;
    if (selectedOption === 1) {
      cuotaConInteres = montoPorCuota - amount2Value;
    } else if (selectedOption > 6) {
      const tasaInteres = 2.21044506; // Reemplazar esto con la tasa de interés correcta
      cuotaConInteres = restoEntreEntregaYMonto / selectedOption;
      cuotaConInteres = cuotaConInteres + cuotaConInteres * tasaInteres / 100; // Aplicar la tasa de interés
    } else {
      cuotaConInteres = restoEntreEntregaYMonto / selectedOption;
    }
  } else {
    if (selectedOption === "1" || (selectedOption >= 1 && selectedOption <= 18)) {
      restoEntreEntregaYMonto = montoPorCuota;
      if (selectedOption === "1") {
        cuotaConInteres = montoPorCuota;
      } else if (selectedOption > 6) {
        const tasaInteres = 3.43660831; // Reemplazar esto con la tasa de interés correcta
        const numCuotas = parseInt(selectedOption, 10);
        cuotaConInteres = calcularCuotaConInteres(parseFloat(montoPorCuota), tasaInteres, numCuotas);
      } else {
        cuotaConInteres = montoPorCuota / selectedOption;
      }
    }
  }

  let restante = montoPorCuota - amount2Value;
  let maxCuotas;


  if (restante <= 3000) {
    maxCuotas = 2;
  } else if (restante <= 4000) {
    maxCuotas = 3;
  } else if (restante <= 5000) {
    maxCuotas = 4;
  } else if (restante <= 6000) {
    maxCuotas = 5;
  } else if (restante <= 7000) {
    maxCuotas = 6;
  } else if (restante <= 8000) {
    maxCuotas = 7;
  } else if (restante <= 9000) {
    maxCuotas = 8;
  } else if (restante <= 10000) {
    maxCuotas = 9;
  } else if (restante <= 11000) {
    maxCuotas = 10;
  } else if (restante <= 12000) {
    maxCuotas = 11;
  } else if (restante <= 13000) {
    maxCuotas = 12;
  } else if (restante <= 14000) {
    maxCuotas = 13;
  } else if (restante <= 15000) {
    maxCuotas = 14;
  } else if (restante <= 16000) {
    maxCuotas = 15;
  } else if (restante <= 17000) {
    maxCuotas = 16;
  } else if (restante <= 18000) {
    maxCuotas = 17;
  } else {
    maxCuotas = 18;
  }


  const response = {
    cuotaConInteres,
    maxCuotas,
    restoEntreEntregaYMonto,
    montorestanteSoloentrega
  };

  res.json(response);
});

app.post('/calculos-slide', (req, res) => {

  const { contadoCdc, financiarCdc, contadoCreditel, financiarCreditel } = req.body;


  let sumaContados = contadoCdc + contadoCreditel
  let sumaFinanciar = financiarCdc + financiarCreditel

  if (isNaN(contadoCdc) || isNaN(financiarCdc)) {
    return res.status(400).json({ error: 'Los valores deben ser numéricos.' });
  }

  const maxAmountCdc = contadoCdc - (0.2 * contadoCdc);
  const minAmountCdc = Math.ceil(0.15 * financiarCdc);
  const maxAmountCreditel = contadoCreditel - (0.2 * contadoCreditel);
  const minAmountCreditel = Math.ceil(0.15 * financiarCreditel);
  const maxAmountCdcCreditel = sumaContados - (0.2 * sumaContados);
  const minAmountCdcCreditel = Math.ceil(0.15 * sumaFinanciar);

  res.json({ maxAmountCdc, minAmountCdc, maxAmountCreditel, minAmountCreditel, maxAmountCdcCreditel, minAmountCdcCreditel })
});

app.post('/guardar-montos', (req, res) => {

  // Obtener los valores necesarios del cuerpo de la solicitud POST
  const { cedula, nombre, contado, financiar, selectedOption, restoEntreEntregaYMonto, cuotaMostrar, amount2Value, cuotapaga } = req.body;

  const fechaCalculo = new Date().toISOString();
  // Ejecutar la consulta INSERT para guardar los resultados en la base de datos
  const query = `INSERT INTO datos_simulador (cedula, nombre, contado, financiar, cantidadCuotas, restanteFinanciar, cuotaPagar, montoEntrega, cuotapaga, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  conntacion.query(query, [cedula, nombre, contado, financiar, selectedOption, restoEntreEntregaYMonto, cuotaMostrar, amount2Value, cuotapaga, fechaCalculo], (error, result) => {
    if (error) {
      console.error('Error al guardar los resultados:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    } else {
      console.log('Resultados guardados correctamente');
      res.status(200).json({ message: 'Resultados guardados correctamente' });
    }
  });
});

app.get('/obtener-ultimo-calculo', (req, res) => {
  const cedula = req.query.cedula;

  // Consultar el último cálculo realizado por el usuario
  const query = `
    SELECT *
    FROM datos_simulador
    WHERE cedula = ? 
    AND fecha = (
      SELECT MAX(fecha) 
      FROM datos_simulador 
      WHERE cedula = ?
    )
    LIMIT 1
  `;

  conntacion.query(query, [cedula, cedula], (error, results) => {
    if (error) {
      console.error('Error al obtener el último cálculo:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    } else {
      if (results.length > 0) {
        const ultimoCalculo = results[0];
        res.status(200).json(ultimoCalculo);
      } else {
        res.status(404).json({ error: 'No se encontraron cálculos para el usuario especificado' });
      }
    }
  });
});

// Agrega credenciales

app.get('/pagar', async (req, res) => {
  const cedula = req.query.cedula; // Obtenemos la cédula de los parámetros de la URL

  try {
    const consultaResponse = await axios.get('http://localhost:5000/obtener-ultimo-calculo', {
      params: {
        cedula: cedula
      }
    });

    const ultimoCalculo = consultaResponse.data;

    res.status(200).json({ preferenceId: preferenceResponse.body.id });

  } catch (error) {
    console.error('Error al obtener el último cálculo:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

mercadopago.configure({
  access_token: "TEST-6288860930249274-080812-c79eef5ece0bb516d25cf2423f84f57c-1409468903",
});

app.post('/pagarFinanciado', async (req, res) => {
  const receivedData = req.body;
  const cedula = parseInt(receivedData.cedula);
  const peopleName = receivedData.peopleName;
  const price = receivedData.price;
  const contado = receivedData.contado;

  let preference = {
    items: [
      {
        title: peopleName,
        unit_price: Number(price) || Number(contado),
        quantity: 1,
      }
    ],
    "payment_methods": {
      "excluded_payment_types": [
        {
          "id": "ticket"
        }
      ],
      "installments": 10
    },
    "back_urls": {
      "success": "http://localhost:5000/index.html",
      "failure": "http://localhost:5000/simulaDeuda2.html",
      "pending": "http://localhost:5000/simulaDeuda2.html"
    },
    "auto_return": "approved",
    external_reference: cedula.toString(),
    notification_url: 'https://mighty-jars-drum.loca.lt/notificacionPago'
  };

  try {
    const preferenceResponse = await mercadopago.preferences.create(preference);
    const preferenceId = preferenceResponse.body.id;
    res.status(200).json({ preferenceId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

app.get('/notificacionPago', async (req, res) => {
  try {
    const notificationData = req.body;

    if (notificationData.action === 'payment.created') {
      // Aquí puedes acceder a los datos relevantes del pago
      const externalReference = notificationData.data.external_reference;
      const paymentId = notificationData.data.id;
      const paymentStatus = notificationData.data.status;

      res.status(200).send('OK');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la notificación');
  }
});

const contacion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'convenios'
});

contacion.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos: ', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});


app.post('/guardar-convenio', (req, res) => {
  const { cedula, contado, financiar, selectedOption, restanteFinanciar, resultado, amount2Value, cuotapaga } = req.body;

  const fechaCalculo = new Date().toISOString();
  // Ejecutar la consulta INSERT para guardar los resultados en la base de datos
  const query = `INSERT INTO conevnios (cedula, contado, financiar, cantidadCuotas, restanteFinanciar, cuotaPagar, montoEntrega, cuotapaga, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  contacion.query(query, [cedula, contado, financiar, selectedOption, restanteFinanciar, resultado, amount2Value, cuotapaga, fechaCalculo], (error, result) => {
    if (error) {
      console.error('Error al guardar los resultados:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    } else {
      console.log('Resultados guardados correctamente');
      res.status(200).json({ message: 'Resultados guardados correctamente' });
    }
  });
});

app.post('/pagosredpagosabitab', (req, res) => {

  // Obtener los valores necesarios del cuerpo de la solicitud POST
  const { cedula, namePeople, entregaArealizar, montoFinanciado, cantidadCuotas, montoPorCuota, deudaContado } = req.body;

  let restante;
  let montoapagar;
  let cuotasPagas = 1;
  let restoCuotas = cantidadCuotas - cuotasPagas;

  if (entregaArealizar == 0) {
    montoapagar = montoPorCuota
  } else {
    montoapagar = entregaArealizar
  }

  if (entregaArealizar == 0) {
    restante = montoFinanciado - montoPorCuota;
  } else {
    restante = montoFinanciado - entregaArealizar
  }

  // Ejecutar la consulta INSERT para guardar los resultados en la base de datos
  const query = `INSERT INTO pagosredpagosabitab (cedula, Nombre, MontoApagar, MontoQueDebe, MontoRestante, Entrega, CantidadDeCuotas, CuotasPagas, CuotasRestante, PagoContado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  conexionPagos.query(query, [cedula, namePeople, montoapagar, montoFinanciado, restante, entregaArealizar, cantidadCuotas, cuotasPagas, restoCuotas, deudaContado], (error, result) => {
    if (error) {
      console.error('Error al guardar los resultados:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    } else {
      console.log('Resultados guardados correctamente');
      res.status(200).json({ message: 'Resultados guardados correctamente' });
    }
  });
});

const conexionPagos = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pagosredpagosabitab'
});

conexionPagos.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos: ', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});
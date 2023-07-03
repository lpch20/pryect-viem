require('./../css/bootstrap.css')
// require('./../css/cards.css')
require('./../css/estilos.css')
require('./../css/maicons.css')
require('./../css/theme.css')


// document.getElementById('token').disabled = true;

// // Función para buscar la cédula en la base de datos de Sheet.Best
// let timerId;

// // Función para buscar la cédula en la base de datos de Sheet.Best
// function buscarCedulaEnBD(cedula) {
//   clearTimeout(timerId); // Limpiar el temporizador si existe

//   // Verificar si el campo de cédula está vacío
//   if (cedula.trim() === '') {
//     return; // No realizar la búsqueda ni mostrar el mensaje
//   }

//   // Mostrar mensaje de "verificando la cédula" después de un tiempo de espera
//   timerId = setTimeout(function () {
//     swal.fire({
//       title: "Verificando cédula",
//       text: "Por favor, espera...",
//       showConfirmButton: false,
//       allowOutsideClick: false,
//       onBeforeOpen: () => {
//         swal.showLoading();
//       }
//     });

//     // Realizar la solicitud GET a la API de Sheet.Best
//     realizarSolicitudGET(url + cedula)
//       .then(data => {
//         if (data.length > 0) {
//           // La cédula existe en la base de datos
//           Swal.fire({
//             icon: 'success',
//             confirmButtonColor: '#3085d6',
//             confirmButtonText: 'Continuar',
//           })

//           console.log(cedula)

//           const cartera = data.map(item => item.Cartera);
//           const contado = data.map(item => item.Contado);
//           const financiar = data.map(item => item.Financiar);

//           localStorage.setItem('cartera', JSON.stringify(cartera));
//           localStorage.setItem('contado', JSON.stringify(contado));
//           localStorage.setItem('financiar', JSON.stringify(financiar));
          
//           document.getElementById("nombre").disabled = true;
//           // Obtener el nombre correspondiente a la cédula
//           const nombre = data[0].Nombre; // Ajusta la propiedad "Nombre" según corresponda en tu base de datos
//           // Establecer el valor del campo de entrada "nombre"
//           document.getElementById("nombre").value = nombre;
//           document.getElementById("nombre").style.borderColor = 'blue'
//         } else {
//           // La cédula no existe en la base de datos
//           Swal.fire({
//             icon: 'success',
//             confirmButtonColor: '#3085d6',
//             confirmButtonText: 'Continuar',
//           })
//           document.getElementById("nombre").disabled = false;
//           // Establecer el valor del campo de entrada "nombre" como cadena vacía
//           document.getElementById("nombre").value = "";
//         }
//       })
//       .catch(error => {
//         // Mostrar SweetAlert indicando que ocurrió un error al buscar la cédula
//         swal.fire("Error", "Ocurrió un error al buscar la cédula. Por favor, intenta nuevamente más tarde.", "error");
//         console.error(error);
//       });
//   }, 500); // Esperar 500 milisegundos (medio segundo) antes de mostrar el mensaje
// }

// window.onload = function() {
//   // Eliminar el valor del almacenamiento local al recargar la página
//   localStorage.removeItem('cartera');
//   localStorage.removeItem('contado');
//   localStorage.removeItem('financiar');
// }

// // URL de la API de Sheet.Best con el endpoint para consultar la hoja de cálculo
// const url = 'https://sheet.best/api/sheets/9c266116-fdf7-4bcd-9105-91a74870f0f0/cedula/';

// // Realiza la solicitud GET a la API de Sheet.Best utilizando fetch
// function realizarSolicitudGET(url) {
//   return fetch(url)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error('Error en la solicitud');
//       }
//     })
//     .catch(error => {
//       throw error;
//     });
// }

// // Evento al salir del campo de entrada "cedula"
// document.getElementById("cedula").addEventListener("blur", function () {
//   const cedula = document.getElementById("cedula").value;
//   buscarCedulaEnBD(cedula);
// });


// // Evento al cambiar el valor del campo de entrada "cedula"
// document.getElementById("cedula").addEventListener("input", function () {
//   clearTimeout(timerId); // Limpiar el temporizador si existe
// });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Evento al cambiar el valor de los campos de entrada
// document.getElementById("nombre").addEventListener("input", verificarCampo);
// document.getElementById("fechaNacimiento").addEventListener("input", verificarCampo);
// document.getElementById("celular").addEventListener("input", verificarCampo);
// // document.getElementById("token").addEventListener("input", verificarCampo);
// document.getElementById("cedula").addEventListener("input", verificarCampo);

// document.getElementById("nombre").addEventListener("blur", function () {
//   verificarCampo(this);
// });
// document.getElementById("fechaNacimiento").addEventListener("blur", function () {
//   verificarCampo(this);
// });
// document.getElementById("celular").addEventListener("blur", function () {
//   verificarCampo(this);
// });
// // document.getElementById("token").addEventListener("blur", function () {
// //   verificarCampo(this);
// // });
// document.getElementById("cedula").addEventListener("blur", function () {
//   verificarCampo(this);
// });

// // Función para verificar si los campos están vacíos y habilitar/deshabilitar los botones
// function verificarCampo(campo) {
//   const valor = campo.value ? campo.value.trim() : '';
//   const regexNombre = /^[a-zA-ZñÑ\s]+$/;;
//   const regexCedula = /^\d{7,8}$/;
//   const regexCelular = /^[0-9+]{8,12}$/;

//   if (campo.id === "nombre") {
//     if (valor !== "" && regexNombre.test(valor)) {
//       campo.style.border = "2px solid blue";
//     } else {
//       campo.style.border = "2px solid red";
//     }
//   } else if (campo.id === "fechaNacimiento") {
//     // Verificar la fecha de nacimiento
//   } else if (campo.id === "celular") {
//     if (valor !== "" && regexCelular.test(valor)) {
//       campo.style.border = "2px solid blue";
//     } else {
//       campo.style.border = "2px solid red";
//     }
//   } else if (campo.id === "cedula") {
//     if (valor !== "" && regexCedula.test(valor)) {
//       campo.style.border = "2px solid blue";
//     } else {
//       campo.style.border = "2px solid red";
//     }
//   }
//   // Obtener la fecha de nacimiento ingresada
//   const fechaNacimiento2 = new Date(document.getElementById('fechaNacimiento').value);

//   // Obtener la fecha actual
//   const fechaActual = new Date();

//   // Calcular la diferencia en milisegundos entre la fecha actual y la fecha de nacimiento
//   const diferenciaTiempo = fechaActual.getTime() - fechaNacimiento2.getTime();

//   // Calcular la edad en base a la diferencia de tiempo
//   const edadEnMilisegundos = new Date(diferenciaTiempo);
//   const edad = Math.abs(edadEnMilisegundos.getUTCFullYear() - 1970);

//   // Verificar si la edad es mayor a 18
//   if (edad < 18) {
//     // La fecha de nacimiento es mayor a 18 años
//     swal.fire("Error", "La fecha de nacimiento es menor a 18 años.", "error");
//   }

// }


// var tokenEnviado = {};
// console.log(tokenEnviado)

// // Evento al hacer clic en el botón "Enviar Token"
// document.getElementById("btn2").addEventListener("click", function () {
//   // const inputTelefono = document.getElementById("celular");
//   // const telefono = inputTelefono.value;
//   // const codigoPais = iti.getSelectedCountryData().dialCode;
//   const celular = document.getElementById('celular').value;


//   // Verificar expresión regular del número de celular
//   const regexCelular = /^[0-9+]{8,12}$/;
//   if (celular === "" || !regexCelular.test(celular)) {
//     swal.fire("Error", "Por favor, ingresa un número de celular válido.", "error");
//   } else {
//     // Mostrar SweetAlert indicando que se está enviando el token
//     swal.fire({
//       title: "Enviando Token",
//       text: "Se enviará un token al número de celular proporcionado.",
//       icon: "info",
//       button: false,
//       closeOnClickOutside: false,
//       closeOnEsc: false,
//     });

//     let codigo = Math.floor(100000 + Math.random() * 900000);
//     // Almacenar el token enviado para el número de celular correspondiente
//     tokenEnviado[celular] = codigo;

//     // Realizar solicitud a la API de Twilio para enviar el token al número de celular
//     fetch('https://api.twilio.com/2010-04-01/Accounts/ACb209049afd0c2f52f479fa00f42f172a/Messages.json', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Authorization": "Basic " + btoa("ACb209049afd0c2f52f479fa00f42f172a:38e1c397c2fd8ac77f0688e11471a020")
//       },
//       body: new URLSearchParams({
//         From: "+14302335340",
//         To: celular,
//         Body: "Tu token es: " + codigo // Aquí debes reemplazar XXXX con el token generado
//       })
//     })
//       .then(response => {
//         if (response.ok) {
//           // Mostrar SweetAlert indicando que el token fue enviado
//           swal.fire("Éxito", "Se ha enviado el token al número de celular proporcionado.", "success");
//           document.getElementById("token").disabled = false;
//         } else {
//           throw new Error("Error en la solicitud");
//         }
//       })
//       .catch(error => {
//         // Mostrar SweetAlert indicando que ocurrió un error al enviar el token
//         swal.fire(
//           "Error",
//           "Ocurrió un error al enviar el token. Por favor, intenta nuevamente más tarde.",
//           "error"
//         );
//         console.error(error);
//       });
//     document.getElementById("token").disabled = false;
//   }
// });


// // Evento al hacer clic en el botón "Verificar Token"
// document.getElementById("btn1").addEventListener("click", function () {
//   // Verificar si los campos están completados correctamente
//   const nombre = document.getElementById('nombre').value;
//   const fechaNacimiento = document.getElementById('fechaNacimiento').value;
//   const celular = document.getElementById('celular').value;
//   const token = document.getElementById('token').value;
//   const cedula = document.getElementById('cedula').value;

//   // Verificar expresiones regulares
//   const regexNombre = /^[a-zA-ZñÑ\s]+$/;;
//   const regexCedula = /^\d{7,8}$/;
//   const regexCelular =  /^[0-9+]+$/;

//   if (nombre === "" || fechaNacimiento === "" || celular === "" || token === "" || !regexNombre.test(nombre) || !regexCedula.test(cedula) || !regexCelular.test(celular) ) {
//     // Campos no completados correctamente, mostrar SweetAlert de error y evitar avanzar a la siguiente página
//     swal.fire("Error", "Por favor, completa correctamente todos los campos antes de continuar.", "error");
//   } else if (parseInt(token) === tokenEnviado[celular]) {
//     // El token ingresado coincide con el token enviado, redirigir a la página deseada
//     window.location.href = './../Html/simulador.html';
//   } else {
//     // El token ingresado no coincide con el token enviado, mostrar mensaje de error
//     swal.fire("Error", "El token ingresado es incorrecto.", "error");
//   }
// });



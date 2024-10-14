'use strict'

//Cargamos el módulo de express
var express = require('express');

//Cargamos el módulo del body parser
var bodyParser = require('body-parser')

//Creamos la aplicación express
var app = express();

//Cargamos las rutas
//var user_routes = require('./routes/user');

//middlewares

///Cuando reciba datos, lo convierte en JSON.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//rutas
///El app.use nos permite que se ejecute el middleware antes de la acción del controlador
//app.use('/api', user_routes);

//exportar
module.exports = app;
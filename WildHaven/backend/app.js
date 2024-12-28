'use strict'

//Cargamos el módulo de express
var express = require('express');

//Cargamos el módulo del body parser
var bodyParser = require('body-parser')

//Creamos la aplicación express
var app = express();


const cors = require('cors');
// Configurar CORS para aceptar solicitudes desde tu frontend Angular
app.use(cors()); 

// Aumentar el límite del cuerpo de la solicitud
app.use(express.json({ limit: '50mb' })); // Para JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Para datos de formularios

//Cargamos las rutas
var user_routes = require('./routes/user');
var task_routes = require('./routes/task');
var specie_routes = require('./routes/specie');
var inhabitant_routes = require('./routes/inhabitant');
var zone_routes = require('./routes/zone');
var inventoryMovement_routes = require('./routes/inventoryMovement');
var inventoryItem_routes = require('./routes/inventoryItem');

//middlewares

///Cuando reciba datos, lo convierte en JSON.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(process.cwd() + '/uploads'))


//rutas
///El app.use nos permite que se ejecute el middleware antes de la acción del controlador
app.use('/api/user', user_routes);
app.use('/api/task', task_routes);
app.use('/api/specie', specie_routes);
app.use('/api/inhabitant', inhabitant_routes);
app.use('/api/zone', zone_routes);
app.use('/api/inventoryItem', inventoryItem_routes);
app.use('/api/inventoryMovement', inventoryMovement_routes);

//exportar
module.exports = app;
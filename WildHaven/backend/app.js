'use strict'

//Cargamos el módulo de express
import express from 'express';

//Cargamos el módulo del body parser
import bodyParser from 'body-parser';

//Creamos la aplicación express
var app = express();


import cors from 'cors';


//Cargamos las rutas
import user_routes from './routes/user.js';
import task_routes from './routes/task.js';
import specie_routes from './routes/specie.js';
import inhabitant_routes from './routes/inhabitant.js';
import zone_routes from './routes/zone.js';
import inventoryMovement_routes from './routes/inventoryMovement.js';
import inventoryItem_routes from './routes/inventoryItem.js';

//middlewares

///Cuando reciba datos, lo convierte en JSON.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(process.cwd() + '/uploads'))

// Habilitar CORS para todas las rutas
app.use(cors());

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
export default app;
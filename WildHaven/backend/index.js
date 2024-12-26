'use strict'

//Importamos Mongoose
var mongoose = require('mongoose');

//Importamos el módulo app con toda la configuración express
var app = require('./app');
require('dotenv').config();

var port = process.env.PORT || 3800;

console.log(port)


//Hacemos la conexión con la base de datos mediante un metodo de promesas
mongoose.Promise = global.Promise;

const mongoDB = process.env.MONGO_URL || 'mongodb://admin:secret@mongodb:27017/wildhaven-db?authSource=admin';
//const mongoDB = process.env.MONGO_URL || 'mongodb://localhost:27017/wildhaven-db';

mongoose.connect(mongoDB)
    .then(() => {
        console.log("La conexión con la base de datos local se ha realizado correctamente.");

        //Crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800")
        })
    }).catch(err => console.log(err));
'use strict'

//Importamos Mongoose
import mongoose from 'mongoose';

//Importamos el módulo app con toda la configuración express
import app from './app.js';

var port = 3800;


//Hacemos la conexión con la base de datos mediante un metodo de promesas
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/wildhaven-db')
    .then(() => {
        console.log("La conexión con la base de datos local se ha realizado correctamente.");

        //Crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800")
        })
    }).catch(err => console.log(err));
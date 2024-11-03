'use strict'

//Cargamos el módulo de mongoose
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

//Definimos el esquema
var Zone = Schema({
    name: { type: String, required: true } ,
    description: String,
    image: String,
});

//exportamos el esquema
export default mongoose.model('Zone', Zone);
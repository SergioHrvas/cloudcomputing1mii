'use strict'

//Cargamos el módulo de mongoose
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

//Definimos el esquema
var Specie = Schema({
    name: {type: String, required: true},
    technical_name: String,
    description: String,
    diet: String,
    image: String,
});

//exportamos el esquema
export default mongoose.model('Specie', Specie);
'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
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
module.exports = mongoose.model('Specie', Specie);
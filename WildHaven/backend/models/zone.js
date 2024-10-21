'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var ZoneSchema = Schema({
    name: { type: String, required: true } ,
    description: String,
    image: String,
});

//exportamos el esquema
module.exports = mongoose.model('ZoneSchema', ZoneSchema);
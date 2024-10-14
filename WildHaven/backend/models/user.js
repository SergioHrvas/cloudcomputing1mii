'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var UserSchema = Schema({
    name: String,
    surname: String,
    password: String,
    email: String,
    role: String,
    image: String,
    created_at: String
});

//exportamos el esquema
module.exports = mongoose.model('User', UserSchema);
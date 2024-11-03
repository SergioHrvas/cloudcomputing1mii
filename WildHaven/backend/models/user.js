'use strict'

//Cargamos el módulo de mongoose
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

//Definimos el esquema
var User = Schema({
    name: String,
    surname: String,
    password: String,
    email: String,
    role: String,
    image: String,
    created_at: String
});

//exportamos el esquema
export default mongoose.model('User', User);
'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var Inhabitant = Schema({
    name: String,
    description: String,
    personality: String,
    image: String,
    birth: Date,
    healthStatus: String,
    vetVisits: [{
        date: { type: Date, required: true },  // Fecha de la visita
        reason: { type: String, required: true },  // Motivo de la visita
        treatments: { type: String },  // Tratamientos aplicados o medicamentos recetados
        vetName: { type: String }  // Nombre del veterinario
      }],
    alive: Boolean,
    specie: {type: Schema.Types.ObjectId, ref: 'Specie'},
    zone: {type: Schema.Types.ObjectId, ref: 'Zone'},
});

//exportamos el esquema
module.exports = mongoose.model('Inhabitant', Inhabitant);
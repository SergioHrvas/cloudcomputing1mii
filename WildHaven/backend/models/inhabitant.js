'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var InhabitantsSchema = Schema({
    name: String,
    description: String,
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
    specie: {type: Schema.Types.ObjectId, ref: 'Specie', required: true},
    zone: {type: Schema.Types.ObjectId, ref: 'Zone', required: true},
});

//exportamos el esquema
module.exports = mongoose.model('InhabitantsSchema', InhabitantsSchema);
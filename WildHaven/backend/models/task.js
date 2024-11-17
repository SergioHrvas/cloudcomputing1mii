'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var Task = Schema({
    name: String,
    description: String,
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User'},
    description: String,
    status: { type: String, enum: ['Pendiente', 'En progreso', 'Completada'], default: 'Pendiente' },
    inhabitant: {type: Schema.Types.ObjectId, ref: 'Inhabitant', required: false},
    zone: {type: Schema.Types.ObjectId, ref: 'Zone', required: false},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true}
});

//exportamos el esquema
module.exports = mongoose.model('Task', Task);